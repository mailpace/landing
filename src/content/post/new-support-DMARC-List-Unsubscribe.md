---
title: MailPace now supports DMARC validation and List-Unsubscribe headers
publishDate: 2021-11-03T22:15:03.284Z
excerpt: In our relentless drive to improve email deliverability for our users, we've added support for DMARC and List-Unsubscribe headers
category: Changelog
---

Delivering emails to inboxes is a complex game, with many factors that feed into spam scores and inbox placement. Today we're pleased to announce additional support for two of these factors:

1. [DMARC validation](https://en.wikipedia.org/wiki/DMARC) - which allows emails sent from MailPace to pass a DMARC policy validation successfully, by setting three additional DNS records
2. [List-Unsubscribe](https://www.ietf.org/rfc/rfc2369.txt) - the ability to set an email header containing a link to an unsubscribe link, for unsubscribing from email mailing lists outside of the email body. Although this is usually reserved for bulk emails, it can be useful for some types of transactional email

To enable DMARC validation (which will also enable a custom Return-Path), head to the [Advanced Verification](https://docs.mailpace.com/guide/verification/#advanced-verification) section of your Domain -> Verification page.

For List-Unsubscribe, set the `list_unsubscribe` option to your unsubscribe link or mailto address in your HTTP requests, use the `X-List-Unsubscribe` header in SMTP requests, or see the documentation for how to set this in your specific integration.

Happy Sending!
