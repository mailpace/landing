---
title: What's a DKIM Record?
publishDate: 2021-02-21T22:00:03.284Z
excerpt: DKIM records are DNS entries that help verify the origin domain of an email
category: Guides
---

A DomainKeys Identified Mail (DKIM) record is a piece of text that you can add to your Domain Name System (DNS). The record is a special key that gives email providers (such as Gmail or Outlook) a way to verify if an email was created by the owner of a domain. Email providers can check each email received against this record to see if it is likely to be spam or forged.

Setting up DKIM will help reduce the chances of your emails being categorized as spam, and help others build confidence that the contents of your emails have come from you, without being tampered with.

## Background

While we can use technologies like the Sender Policy Framework (SPF) to validate that an email came from the server that it says it came from (more on SPF [here](/blog/whats-an-spf-record)), we need a way to ensure that the email itself was written by the owner of the domain, or someone allowed to write emails on their behalf.

We need to do this because most domains use a shared email server or provider to send emails, so the email contents themselves need to be verified in case a hacked server or malicious shared account is used to send spam or forged emails.

One of the other cool uses of DKIM is to validate that an email hasn't been tampered with, which has been used in some [very high profile situations](https://www.wikileaks.org/DKIM-Verification.html) to prove that the email must have come from the original domain, without modification.

## So how do DKIM records work?

If you own a website or domain, you'll have access to the DNS records for that domain through your registrar. Only the owner of a domain can modify these records, which means that **whatever appears in those records, we can assume was put there by the owners of the domain**. By combining this with cryptography, we can create a method (DKIM) to validate the contents of an email.

This is where [Public-Key Cryptography](https://en.wikipedia.org/wiki/Public-key_cryptography) comes in, one of the most important pieces of technology in existence today. Public-Key cryptography is a cryptographic system that consists of two keys, Public and Private. It's used in everything from Bitcoin to SSH, and we can use it to prove that an email originates from the owner of the domain.

To do this the person writing the email will make a "signature" using their private key and include it in the email headers. This signature is calculated by taking the contents of the email and running it through a one-way function. This one-way function produces an output that can be validated by the public key. The exact way keys and signatures are calculated and validated is really interesting, and worthy of an entire article on its own, but you don't need to know the specifics to understand DKIM.

This means that **emails with a signature attached that match the public key can only have been created by someone with the corresponding private key**. The private key is kept private by the original author, so we can be confident in the authenticity of the message.

With DKIM we put the public key in our DNS record (proving that this public key is the right key for our domain), and just before the email is sent we sign it with the private key. When the email is received by the end user their email server will lookup the DNS records for the domain in the `From` part of the email, download the public key and validate it against the signature. If the validation passes, the email must have come from that domain, or someone who has the private key for that domain.

## What does a DKIM record look like?

Here's the DKIM record for [MailPace.com](https://mailpace.com):

```
mailpace._domainkey
v=DKIM1; h=sha256; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC9iJpPrQh0HoQPYAMC+eytJp1Ey9uz932X/e+6kzMa9hGZQEYcj5/bOgjHN0Sgi+4ampvwlGY4jPC0aL1fMM9fpmXhCbijvGaWYatPGkngL+kXB0BqS512kQH4IiaGnPKOFErplW9192KjYXdHJFSLkKNKBlxn09CpAMUYvzTMzQIDAQAB;
```

Let's break it down:

- The first line `mailpace._domainkey` is the name of the `TXT` record, and is used as a selector to identify the record among other DNS entries. The matching DKIM signature will have this selector included in the header, so the receiving email server knows where to look. You can have multiple DKIM entries, provided the selectors are different, which can be useful if you want to send using different private keys. If you need to support subdomains, they can be appended to the end e.g. `mailpace._domainkey.sub.domain`

The next line has three parts:

- `v=DKIM1` tells us that this is an DKIM record, and it's a Version 1 record. There's only one version at present, so this will always be the same for the forseeable future
- `h=sha256;` This is the hash method used to create the public/private key and sign the email. This is important as it's the algorithm the email server should use to validate the signature. There are several supported algorithms, but a large number are outdated and potentially insecure, **for you now you should use `sha256`** - in theory `Ed25519` is also viable and produces nice short keys, however when testing we found that some email servers didn't successfully validate these keys
- Finally we have the actual public key in the `p=` - this is the public key used to validate the email signature

To add this to your DNS record, open up your domain registrar or DNS management console, and add a new `TXT` record with the text as your content and name as above. If you're using a service to send emails on your behalf your email service provider will give you the exact record details you need, if you're sending emails from your own server you'll need to write your own record that matches your DKIM implementation (particularly the selector and algorithm choice), which will be heavily dependent on the email server you're using.

Simple, right?

## How to use DKIM with MailPace

The good news is that MailPace signs all emails by DKIM automatically for you, we also generate and store the private keys, so all you need to do is add the public key we provide onto your DNS record, and DKIM will work like magic.

When you setup your first domain, we'll take you through an onboarding process to set things up, and you can re-do the verification process at any point on the Verification section of your domain.

Note that **we don't let anyone send emails through our platform without DKIM validation** - it's a simple thing that's too easy for spammers to abuse if we don't enforce it. If you're using an email provider that doesn't enforce DKIM validation, find a new provider, it's not hard to do and and it really does help prevent spam.

## Further reading

If you want to learn everything there is to know about DKIM, there are three RFC ("Request For Comments") specifications to read here:

- [RFC 6376](https://tools.ietf.org/html/rfc6376) - The current main specification (September 2011)
- [RFC 8301](https://tools.ietf.org/html/rfc8301) - Updated key sizes and algorithms (January 2018)
- [RFC 8463](https://tools.ietf.org/html/rfc8463) - Adding Ed25519 to supported algorithms (September 2018)

Happy reading!
