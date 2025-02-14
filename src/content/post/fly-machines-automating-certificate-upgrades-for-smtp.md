---
title: Automating certificate upgrades in hard to reach places
publishDate: 2023-03-30T11:15:03.284Z
excerpt: How we used environment variables and Fly Machines to automate our TLS certificate renewal for our SMTP servers
category: Guides
---

# Why no reverse proxy?

At MailPace we have two services, both written in Typescript that accept emails over SMTP. They are our inbound server and our SMTP gateway, over at inbound.mailpace.com and smtp.mailpace.com respectively.

To secure the connection between the sending server and our server, we need to have a TLS certificate on each of our servers. This will allow clients to negotiate an encrypted connection, either over TLS from the outset or via a STARTTLS upgrade from an insecure connection.

Normally, one would set up a reverse proxy with inbuilt cert renewal, or a cloud-based WAF type service to handle TLS connections. However, in the case of SMTP, we need to negotiate the TLS connection with our SMTP server directly to handle things like STARTTLS properly. Unlike HTTP, there aren't many (any?) SMTP-compatible reverse proxies that will handle this kind of exchange for us.

So we need a way to refresh our certificates on each of our node apps, one by one.

# We ❤️ Containers

We originally started MailPace with mutable servers. That is, we had Ubuntu servers with our apps installed by a set of bash scripts. Over time, this became increasingly difficult to manage and track, so we switched over to Docker based infrastructure and are leveraging cloud based IaaS providers (specifically https://fly.io and https://clever-cloud.com). The nice thing about these services is that you just provide a dockerfile, and they handle everything else, including scaling.

The underrated feature of this is that **it forces you to develop your apps in an ephemeral, immutable, 12-factor style**, with configuration driven by environment variables. This means that when we revisit our server 6 months later, we know exactly what we have, and can replicate it locally, in staging or wherever.

# The hacky route

Our certificates were originally delivered inside the container, and every 2 months we would run a certbot command to get new certs, save them and do a new build with updated certificates.

The cert files were 2 .pem files, which we imported into our SMTP server like this:

```javascript
{
	key: fs.readFileSync('/usr/src/app/setup/privkey.pem'),
	cert: fs.readFileSync('/usr/src/app/setup/fullchain.pem'),
	...
}
```

Apart from storing private keys in source control, this method was fraught with issues, namely, **what if we forget to update the certs?**

# Full automation

## Step 1: Change to env variables

We can change the above code to use env variables instead

```javascript
{
	key: process.env.PRIVATEKEY,
	cert: process.env.FULLCHAIN,
	...
}
```

Now we can pass in an environment variable (e.g. with `fly secrets import`) for each of the containers. This will deploy a fresh container with the updated certs.

But wait, our .pem files contain line breaks, which breaks this. So we need to base64 our certs first, then pass them.

On the machine with the certs:

`base64 private.pem > base64_private.pem`
`base64 fullchain.pem > base64_fullchain.pem`

and on our node app:

```javascript
{
    key: Buffer.from(process.env.PRIVATEKEY, 'base64').toString('ascii'),
    cert: Buffer.from(process.env.FULLCHAIN, 'base64').toString('ascii'),
	...
}
```

Now we can pass in base64 strings, which won't break our app. Phew.

## Step 2: Script all the things

We have a script to update our certs and a programmatic way to do it, we need a way to run this process regularly.

We decided to use a [Fly machine](https://fly.io/blog/fly-machines/), and write a simple dockerfile that would manage the certificate upgrades for us. Here's the dockerfile, which installs certbot, the fly-cli and a few other pieces, before setting up our script.

```docker
FROM debian:latest
RUN apt-get update
RUN apt-get -y install python3-pip certbot curl jo nodejs npm
RUN pip --no-cache-dir install -U certbot-dns-cloudflare
RUN curl -L https://fly.io/install.sh | sh

WORKDIR /usr/src/app

COPY . .

RUN cd cert-test && npm install
RUN chmod +x ./entrypoint.sh

CMD ["/bin/bash", "-c", "-l", "./entrypoint.sh"]
```

Here's the actual `entrypoint.sh` script that runs on boot of the container, helpfully annotated by ChatGPT

```shell
#!/bin/bash

# Redirect stdout and stderr to a file and print them to the console
exec > >(tee -ia output.log)
exec 2> >(tee -ia output.log >&2)

# Stop the script if any command fails
set -e

# Write Cloudflare API token to a file and set permissions
# We use this to update the Cloudflare DNS with the Certbot challenge
echo "dns_cloudflare_api_token = ${CLOUDFLARE_API_TOKEN}" >./cloudflare.ini
chmod 600 ./cloudflare.ini

# Get SSL/TLS certificates using Certbot and Cloudflare DNS plugin
echo "== Getting certs"
certbot certonly \
  --agree-tos \
  --register-unsafely-without-email \
  --dns-cloudflare \
  --dns-cloudflare-credentials ./cloudflare.ini \
  --dns-cloudflare-propagation-seconds 30 \
  -d smtp.ohmysmtp.com \
  -d smtp.mailpace.com

# Encode the private key and fullchain certificates in base64 format and save them
echo "== Encoding certs to base64"
base64 -w 0 /etc/letsencrypt/live/smtp.ohmysmtp.com/privkey.pem >./smtp-privkey-base64.pem
base64 -w 0 /etc/letsencrypt/live/smtp.ohmysmtp.com/fullchain.pem >./smtp-fullchain-base64.pem

# Format the environment file with the encoded certificates
echo "== Formatting .env files"
echo -n "PRIVATEKEY=" >./.smtp.env
cat smtp-privkey-base64.pem >>./.smtp.env
echo -e -n "\nFULLCHAIN=" >>./.smtp.env
cat smtp-fullchain-base64.pem >>./.smtp.env

# Validate the SSL/TLS certificates using a Node.js script, this just starts a server to test that we actually have correctly received certs and encoded them
echo "== Validating certs..."
node cert-test/index.js
echo "== Cert validation complete."

# Import the environment file as secrets to the Fly apps
echo "== Updating SMTP cert"
cat .smtp.env | ~/.fly/bin/fly secrets -t ${FLY_ACCESS_TOKEN} -a ${FLY_SMTP_APP_NAME} import

# Send an email notification to ourselves using the MailPace API
echo "== Sending Email Notification"
output=$(cat output.log)
curl "https://app.mailpace.com/api/v1/send" \
  -X POST \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -H "MailPace-Server-Token: ${MAILPACE_TOKEN}" \
  -d "$( jo \
        from="support@mailpace.com" \
        to="support@mailpace.com" \
        subject="Inbound & SMTP Certs Updated. Logs." \
        textbody="$output")"
```

# Step 3: Deploy and schedule

Fly Machines are quite cool in that you can have them run on schedule or wake on HTTP request.

We set ours up like this:

1. Create the machine:

`fly apps create --machines --name mailpace-cert-renewer`

2. Provide the fly, cloudflare and mailpace tokens for this machine by adding the keys to .env and running:

`cat .env | fly secrets import -a mailpace-cert-renewer`

3. Set the machine to run on a weekly schedule, with restart policy set to No (**very important, otherwise it will keep re-running the renewal!**):

`fly machine run . -a mailpace-cert-renewer --schedule weekly --restart no --region cdg`

And that's it, no more cert renewal woes!
