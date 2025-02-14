---
title: What's an SPF Record? - Ultimate Guide to Email
publishDate: 2021-02-08T22:00:03.284Z
excerpt: SPF records are DNS records that help prevent SPAM and forged emails
category: Guides
---

A Sender Policy Framework (SPF) record is a piece of text that you can add to your Domain Name System (DNS). It tells email clients (such as Gmail or Outlook) who can send email from your domain, and those clients can check each email received against this record to see if it is likely to be spam or forged.

## Background

SPAM has been sloshing around on the internet since forever (well [since 1978, apparently](https://www.themarysue.com/first-spam-email/), and so have methods to fight it. SPF is a neat way to help prevent your domain name from being abused for appearing to send spam or forged emails.

The thing with email is that anyone can pretend to send emails from anyone else, there's nothing in the specifications that prevent this. To impersonate someone, all you have to do is change the `From` email header to say it came from them. To make matters worse, emails are handed between lots of different servers when being sent, and are rarely encrypted to prevent modifications en-route.

Why is this allowed? Well email is really, really old! No one designing email could have possibly anticipated the kind of spam we see today, and computers just didn't have the power or resources to do complex cryptography and a gazillion network requests back in the day.

Fortunately there are some technologies (including SPF) that work together to help validate that an email has come from the person/place it claims to have come from.

## So how do SPF records help prevent spam?

An SPF record says which mail servers are allowed to send email on your behalf. So when an email arrives from a particular server, the receiving server can look up the SPF record of the domain in the `From` field and validate that the server is allowed to send email for that specific Domain.

If no match is found, then depending on the SPF policy in the record, the email will be marked as spam, outright rejected or have its spam score lowered.

Without SPF there would be no way to check that the server that sent an email is actually allowed to send emails for the domain. By adding an SPF record you're telling the world that this particular IP, service or set of IPs is allowed to send email for that domain.

## What does an SPF record look like?

Here's a simple record:

```
v=spf1 ip4:192.168.0.1 ~all
```

Let's break it down:

- `v=spf1` tells whoever is looking this up that this is an SPF record, and it's a Version 1 record. There's only one version at present, so this will always be the same for the forseeable future
- `ip4:192.168.0.1` is an IP address that's allowed to send emails from this domain. You can list multiple IPs here by including a space between them, add ranges or even full domains
- `~` is one of four _qualifiers_ which tells the email client how to mark an email that matches the term to the right (in this case `all`). The options are pass (+), fail (-), softfail (~) or neutral (?) - using these allows you to do things like whitelist or blacklist addresses, or completely disable all emails from a given domain
- `all` simply says match all emails

Email clients will evaluate this record **from left to right**, looking for a match against the IP address that the email actually originated from. So if an email came from 192.168.0.1 it will match this record and pass SPF, but if it didn't arrive from there it will match `all` and be marked as a softfail (because of the `~`). Softfail means that the email should not be rejected for this reason alone, but it will be factored into the spam score.

To add this to your DNS record, open up your domain registrar or DNS management console, and add a new `TXT` record with the text as your content. If you're using a service to send emails on your behalf your email service provider will give you the exact record details you need, if you're sending emails from your own server you'll need to craft your own record, you can use [RFC7208](https://tools.ietf.org/html/rfc7208) as a reference to get it perfect.

Easy-peasy lemon squeezy!

## Why don't you need to setup an SPF record with MailPace?

The good news is that you don't need to know any of this or do anything to use MailPace and have your emails pass SPF validation.

We set a specific header in the email called `Return-Path` with all emails sent through our email service. If you take a peek at a raw email sent over MailPace you'll find that the return path ends in `@mailer.mailpace.com`, and if you look this up in the DNS system, you'll find an SPF record that points to our server IP address.

Luckily email clients accept the return path header as the source of the email, so SPF checks pass on all our emails. without our users needing to do anything. If you do want to set your own SPF and DMARC policies with MailPace, you can enable (Advanced Verification)[https://docs.mailpace.com/guide/verification#advanced-verification]

## Other technologies and further reading

If you want to learn everything there is to know about SPF, you can read the RFC ("Request For Comments", basically the SPF specification) here: https://tools.ietf.org/html/rfc7208

But SPF alone doesn't completely solve spam, we also need DKIM, and to a lesser extent DMARC. More on those later!
