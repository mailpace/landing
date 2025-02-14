---
title: How to set up more than one SMTP provider
publishDate: 2024-07-28T08:00:03.284Z
excerpt: Setting Up Multiple SMTP Transactional Email Providers, A Guide for Developers
category: Guides
image: ~/assets/images/blog/title_cards/how-to-set-up-two-smtp-email-providers.png
---

At MailPace, we believe in simple, fast, and reliable email delivery for your applications and services. To make this a reality, we strongly recommend that all developers working on email set up two or more SMTP providers (ideally we should be one of them), and split traffic, or be ready to swap over as needed.

But it can be a bit tricky to get right, so here's a quick guide on the hardest part (SPF).

## Why more than one?

Using multiple SMTP providers can provide several benefits:

- Reliability: By having a backup provider, you can ensure that your emails continue to be sent when (not if) one of your providers experiences issues
- A/B Testing of delivery rates/speed: not all providers are equal, and you'll find different results if you test across them
- Scalability: If you experience a sudden surge in traffic, using another provider can help distribute the load and ensure your emails don't get delayed or land in spam
- Vendor lock in: it's always better to have choices

## So how do I do it?

Once you've decided this is a good idea, you'll need to:

1. Set things up for sending
2. Identify how to failover between them

## Setting up

Setting things up is quite easy - simply register and set up all your DKIM records etc. as usual.

However there is one area to watch out for. The Sender Policy Framework (SPF) dictates which IPs can send from your domain, and it's being used more and more these days by inbox providers to check the validity of emails. At MailPace, and some providers, you have two options:

1. Have emails with a return path header of `mailer.ohmysmtp.com` (default), which has our shared SPF record
2. Complete Advanced Verification, to have emails go out with your own domain as the return path, and set a CNAME record to hand over lookups to `mailer.ohmysmtp.com` - to get the shared SPF record

If you've picked option 2, for any of your providers, you'll need to set two SPF records for the same domain in your return path. However this a problem, you can only have one SPF record per domain (technically you can have more than one but only the first one will be used by the SMTP server).

If you're switching over, you'll need to change these DNS records as well, not ideal and very difficult to automate.

### So what's the fix?

It's quite simple, there is an `include:` statement you can use as part of the SPF record. Simply include both MailPace (ohmysmtp) and the other provider together, like this:

`v=spf1 include:mailer.ohmysmtp.com include:otherprovider.com -all`

The `include` portion allows you to combine the records, and ensure they'll pass SPF checks if the records at ohmysmtp and otherprovider contain the right IPs.

That's it!
