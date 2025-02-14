---
title: What is Reverse DNS (rDNS) and how does it work?
publishDate: 2021-10-06T09:00:03.284Z
excerpt: A guide to Reverse DNS (rDNS) and PTR records
category: Guides
---

## Background

[DNS (Domain Name System)](https://en.wikipedia.org/wiki/DNS) is a system that provides a key-value data store for domain information. Its primary use is to link a domain to an IP address, although it is often used for other records like [SPF](https://blog.mailpace.com/blog/whats-an-spf-record/) and [DKIM](https://blog.mailpace.com/blog/whats-a-DKIM-record/)

When you access a website you usually have an easy to read domain, and to find the computer behind that domain your browser will query a DNS server for the IP address associated with it. These records are set by the domain owner, and if you have ever built a website or app you're probably familiar with setting this up.

But what about when you know the IP address, but not the domain? Enter Reverse DNS, often stylised as rDNS.

## What is Reverse DNS (rDNS)?

Reverse DNS is a mechanism to identify a domain name associated with an IP address.

> If you have an IP address, and you want to know what domain that IP address resolves to, you use an rDNS lookup to find out the domain

## But Why?

The obvious case is for spam filters: email always comes from an IP address, so checking the IP address matches up with the sending domain can be a useful indicator of spam. **This is why you should set an rDNS record if you’re hosting your own email server**.

But there are other situations where rDNS is useful, such as tracking down a hacker by IP address or determining the hosting provider behind an IP address.

## How does it work?

Reverse DNS records are maintained as PTR (short for Pointer) records under the [Address and Routing Parameter Area (ARPA) top level domain](https://www.iana.org/domains/arpa). Most people have never heard this domain, but it is one of the oldest and most important pieces of infrastructure that powers the internet. The `.arpa` TLD is used for domain management of technical network infrastructure across the internet, and was originally introduced in January 1985.

It was intended to be used to transition from [ARPANET](https://en.wikipedia.org/wiki/ARPANET) (a precursor to the Internet), but remains to date and will probably be there indefinitely.

There are two subdomains that are used for rDNS records on `.arpa`:

- `in-addr.arpa` - for IPv4 rDNS records
- `ip6.arpa` - for IPv6 rDNS records

The name of a PTR rDNS record looks like this:

`<REVERSED IP ADDRESS>.<SUB_DOMAIN>.arpa`

Where IP Address is your IPv4 or IPv6 address **in reverse** and Sub Domain is the IPv4 or IPv6 subdomain above.

When we run an rDNS lookup we're querying the `.arpa` domain for a PTR record that matches the above. The domain that the IP address maps to is also stored in the zone file alongside this and is returned in the lookup.

## How to lookup an rDNS record

We can use the [dig](https://www.isc.org/bind/) command line tool to do a lookup in the DNS records. Here's an example using one of our IP addresses:

```
$ dig -x 193.33.178.182 +noall +answer

; <<>> DiG 9.10.6 <<>> -x 193.33.178.182 +noall +answer
;; global options: +cmd
182.178.33.193.in-addr.arpa. 300 IN	PTR	mailer.mailpace.com.
```

- `-x` tells dig to translate our lookup into an rDNS query
- `+noall` hides all of the response
- `+answer` shows the answer itself

The keen-eyed among you will see that the IP address above is backwards, so what we actually have in our PTR record is `182.178.33.193` (which really means `193.33.178.182`) points to `mailer.mailpace.com`. This means that when an email comes from this IP address, the rDNS query made by most spam filters will resolve to `mailer.mailpace.com`. We set the hostname of our `ReplyTo` header in all our outgoing emails to this domain, so that these email servers can match up the email hostname to our IP using this this mechanism.

## How to set an rDNS record

For most people, the answer is to **contact to your web host or server provider**. This is because you need to have IP authority to set an rDNS record. Most web hosts will have a way to set this for you through their UI or support team.

However if you’re lucky enough to have authority over your IPs you can set these yourself. To do this you need to create the reverse DNS zone on the authoritative DNS nameserver for the IP address of your server. You can find out what your authoritative name server is using `dig`.

Create and save a PTR record using the format above ( remember to reverse the IP!) and save it as a new record e.g.

`182.178.33.193.in-addr.arpa. 300 IN	PTR	mailer.mailpace.com.`

And that's it!

## Further Reading

https://datatracker.ietf.org/doc/html/rfc5855
https://en.wikipedia.org/wiki/Reverse_DNS_lookup
https://en.wikipedia.org/wiki/.arpa#Reverse_IP_address_mapping
