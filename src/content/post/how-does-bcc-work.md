---
title: How does BCC work?
publishDate: 2023-09-16T13:00:03.284Z
excerpt: A technical explanation of how CC, BCC, and SMTP Envelopes work in email
category: Guides
---

Everyone knows that BCC means Blind Carbon Copy, and putting an email address into the BCC field means that the address in BCC will receive the email, but the other people in To or CC will not be aware.

But how does this mysterious magic work?

## A basic SMTP example

When you send an email, under the hood the SMTP commands look like this:

```bash
EHLO sender.example.com
250-ServerName.example.com Hello sender.example.com
               250-SIZE 10240000
               250-STARTTLS
               250 OK

MAIL FROM: <sender@example.com>
250 OK

RCPT TO: <recipient@example.com>
250 OK

DATA
354 Start mail input; end with <CRLF>.<CRLF>

(Email content and headers)

250 OK
QUIT
```

_The upper case entries are SMTP commands issued to the server, the numbers are status codes returned by the server._

If you follow along, we’re saying hello to the server (`EHLO`), acknowledging some protocol information, then asking the server to send an email from the `MAIL FROM` address, to the `RCPT TO` address. And then we provide the email itself, any attachments etc. Finally we say `QUIT` to end the session.

> We call the combination `FROM` and `RCPT TO` the envelope (akin to a real world envelope, kind of).

Note that **the envelope is never shown to the recipient, it's only used by the email server to route the email**. This is important later when we talk about how BCC is handled.

## But how to CC and BCC recipients?

One would assume there is a CC and BCC command, like `RCPT CC` and `RCPT BCC`, but no that would be too obvious for SMTP. Instead **we include all the email CC and BCC addresses in the `RCPT TO` command together**, with nothing to distinguish them.

This is all the SMTP Envelope allows us to specify, who the email is from and where it’s going to. The email server will take the envelope, and try to deliver the email to everyone in the `RCPT TO` list.

## Then how does the email server know who is a CC and who is a BCC?

It doesn’t - instead **the CC and BCC recipients are defined only inside the email headers**, where we include other details about the email and the email parts themselves. Well actually, only CC is defined, the trick is that **the BCC list is omitted altogether from the email itself, but BCC recipients are included in `RCPT TO`**. Here's an example.

### The SMTP commands (the envelope), note we send to three people:

```bash
MAIL FROM: <alice@example.com>
250 OK

RCPT TO: <bob@example.com>,
250 OK

RCPT TO: <carol@example.com>,
250 OK

RCPT TO: <ted@example.com>,
250 OK
```

### And the email headers and content (provided inside the `DATA` command):

```
Message-ID: <ABC12345@example.com>
Date: Thu, 16 Sep 2023 14:30:00 +0000 (UTC)
From: Alice <alice@example.com>
To: Bob <bob@example.net>
Cc: Carol <carol@example.net>
Subject: Hello, Everyone!
MIME-Version: 1.0
Content-Type: text/plain; charset="utf-8"
Content-Transfer-Encoding: 7bit

Hello Bob,

Carol is copied, but I’ve sent this to someone else and you’ll never know who it is...

Alice
```

_This header is crafted by the sender, and added inside the email (after the DATA command above)._

As you can see we have `RCPT TO` commands for Bob, Carol, and Ted, but only Bob and Carol are listed in the email header. Implicitly, Ted is therefore a BCC recipient, and will receive the email without being mentioned anywhere in the email header itself.

When the email is sent, the SMTP server only concerns with who to deliver it to from `RCPT TO``, and not who is actually on the To, CC and BCC lists. It’s up to the email client to display this correctly (eg with To, From and CC shown).

## Strangeways, here we come

This means you can do some funky, nefarious things, like have a totally different set of addresses in From, To, and CC headers, from the actual envelope, which an email client will dutifully display. Users can be shown a different list of who the email went to, from the reality of what actually happened - which is really what happens when we BCC someone.

> Pro tip: You can also spoof other headers, like Date 😲

Luckily we have things like [DKIM](https://blog.mailpace.com/blog/whats-a-DKIM-record/), [SPF](https://blog.mailpace.com/blog/whats-an-spf-record/) and DMARC to help combat email abuse, but email is a wild, wild world.
