---
title: What is BIMI?
publishDate: 2022-05-12T16:10:03.284Z
excerpt: Brand Indicators for Message Identification (BIMI) is a standard that helps email senders display a logo next to their emails in a recipients inbox
category: Guides
---

[Brand Indicators for Message Identification (BIMI)](https://bimigroup.org/) is a standard that allows an email sender to specify a logo to display alongside their name in an inbox.

There are a lot of complex guides for how it works, but it's actually quite simple.

# How does it work?

When an email is received by a mailbox provider, they use the Domain Name System (DNS) to check the validity of the email. Specifically they will check the email's cryptographic signature using [DKIM](https://blog.mailpace.com/blog/whats-a-DKIM-record/), validate the sending domain using [SPF](https://blog.mailpace.com/blog/whats-an-spf-record/) and finally combine them together with a [DMARC policy](https://en.wikipedia.org/wiki/DMARC). All of these things are specified in the DNS record of the domain that the email comes from, or the `Return-Path` of the email.

By specifying an optional `default._bimi` DNS TXT record on the sending domain, with a link to a logo in the content, the mailbox provider will look up that logo (provided DMARC passes with a strict/quarantine policy), and show it to users.

# VMC Certificates, what are they?

To ensure that logos are actually truly representative of the brand involved, and more cynically, to make money and penalize small senders, an optional Verified Mark Certificate can be added to the DNS records, which some mailboxes will validate before showing the logo.

At the time of writing this, this **certificate is provided by only two specific registrars** (see https://bimigroup.org/vmc-issuers/ for a list), who will verify that the logo provided is a registered trademarked logo before issuing the certificate.

> Hint: If you want your BIMI logo to show up in the world's largest mailbox provider, Gmail, you must have a valid VMC certificate

Unfortunately **VMC certificates cost upwards of $1000 USD** to purchase. Which puts them out of reach for casual or small senders (of which we are big supporters here at MailPace), and undermines the BIMI effort overall.

# Get setup with BIMI

If you still want to get setup with BIMI, it's straightforward. You'll need to be able to host an SVG file and modify the DNS records for your sending domain.

Here's how you can do it with MailPace (or another provider):

- Ensure that you have enabled [DMARC support](https://docs.mailpace.com/guide/verification#advanced-verification)
- Set your DMARC policy in your DNS record to `p=reject` or `p=quarantine`. If you are also using the `pct` variable, ensure it is set to `100` or omitted
- Create a square, SVG logo, that is less than 32kb and has a solid background colour, and upload the SVG logo to a public location
- Create a new TXT DNS record for your domain with the following details, where the `l` URL is the location of your SVG logo and the `a` URL is the location of your VMC certificate (if you have one):
  - Name `default._bimi`
  - Contents:
  ```
  v=BIMI1; l=https://example.com/images/bimi-logo.svg a=https://example.com/VMC-certificate.pem;
  ```
  Note that the a variable should be omitted if you do not have a VMC certificate

That's it. Once your DNS records are updated, mailboxes that support BIMI should start showing your logo.
