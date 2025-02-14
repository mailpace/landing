---
title: What an email really looks like
publishDate: 2024-02-05T22:22:03.284Z
excerpt: A detailed guide on how emails are structured, focused on how headers and Multipurpose Internet Mail Extensions (MIME types) are used to structure the email
category: Guides
---

# What does an email even look like?

You probably think it's simple, but if you've ever opened up an email in a text editor, or clicked on "Show Original" Gmail. or "View Source" in Outlook, you'll have seen the raw, text-based email contents, and most of it looks like gobbledegook!

You can see an [example email here](../../assets/images/blog/example_email.txt).

A simple email, but there's a lot of strange text! Let's simplify things a little, by breaking it down.

## Email Headers

These are what you see at the start. They were first mentioned in [RFC733](https://www.rfc-editor.org/rfc/rfc733), back in 1977(!), but have since been revised a few times over e.g. in [RFC5322](https://www.rfc-editor.org/rfc/rfc5322), [RFC6854](https://www.rfc-editor.org/rfc/rfc6854) etc. who really knows what to believe nowadays.

In an email they look like this:

```
Delivered-to: recipient@example.com
Return-Path: <bounces+40c3434d-6864-4182-aa17-86c9b2082aa0@mailer.ohmysmtp.com>
Date: Mon, 05 Feb 2024 11:57:22 +0000
From: "Test Name.com" <test@mailpace.com>

and so on....
```

They are essentially key value pairs, and are reasonably understandable by just looking at them.

Email clients will hide most of these from users, showing only the most important ones like, date, from, to, cc etc. You can set these headers to be anything you like, including who the email was from, and to! This makes for some interesting spoof emails, and also is a key part of [how bcc works](https://blog.mailpace.com/blog/how-does-bcc-work/).

Some interesting ones you might not have seen before are the [DKIM results](/blog/whats-a-DKIM-record/) `Authentication-Results` and the [SPF results](/blog/whats-an-spf-record/) `Received-SPF`.

Emails servers can, and regularly do inject their own headers (e.g. spam scores, where the email originated from etc.), so you'll see lots of different headers in emails that you might take a look at.

### Content-Type

There's a small set of very special headers towards the bottom:

```
Mime-Version: 1.0
Content-Type: multipart/mixed;
 boundary="--==_mimepart_65c0cd21dd978_1206c010771";
 charset=UTF-8
Content-Transfer-Encoding: 7bit
```

**Mime-Version**

The [MIME protocol version](https://en.wikipedia.org/wiki/MIME). This will always be `1.0`. Forever. There is **never** going to be a way to define a 1.1 or 2.0 version of MIME.

> There are around 400 billion emails sent every day, if UTF-8 encoded this string takes up 16 bytes. That's 6 Terabytes of data, every day, flying around the world for no reason. Think about that every time your phone pings.

**Content-Type**

This is where email gets interesting (finally!). This header tells us what's coming up in the email itself. You'll see two types here:

1. Discrete - if the email is just a single item, usually text or html, e.g. `text/plain` or `text/html`, but sometimes (in an email) this could be an attachment. Here's a [big list of MIME types](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types)
2. Multipart, which means the email is made up of (you guessed it) Multiple Parts. It's usually one of these two, and multipart is what you'll see the most:

- **multipart/alternative:** Signifies that the email contains multiple representations of the same content, each in a different format. Typically, this includes both plain text and HTML versions of the message, allowing the email client to choose the most suitable format to display. Remember to put this in order, the last one is the one the email client is supposed to prioritise.

- **multipart/mixed:** Allows mixing up different pieces of content into one email, so you can have text, html, three attachments, an inline image, some additional secret content, and more!

There is also **multipart/related:** which you'll most likely see nested further down in the email. It ensures that all related parts (e.g. inline images) are bundled together.

#### Then we have the `boundary` parameter

For multipart emails, the `boundary` parameter, inside content type, defines a, usually random, unique string that separates the different parts of the message. Initially at the start of the email, but then repeated at the end of the email to close it off. This becomes very important

Finally, the **charset**, used to decode text parts. This is usually [UTF-8](https://en.wikipedia.org/wiki/UTF-8) but could be [ASCII](https://en.wikipedia.org/wiki/ASCII) or all kinds of exotic values.

**Content-Transfer-Encoding**

The encoding method used to transfer the data:

- `7bit` is for plain text with no additional encoding
- `quoted-printable` is usually for plain text with special characters or non-ASCII characters, like HTML. It represents these characters in a way that ensures compatibility with email systems, allowing for a more efficient and readable representation.
- `base64` for binary data, such as images or attachments. By converting data into base64 text it can be sent through text based email systems

## Where do email headers end and the actual email begins?

The headers can be in any order, but the keen eyed among you may have noticed something in the email. There's a blank line between these two lines:

```
Content-Transfer-Encoding: 7bit


----==_mimepart_65c0cd21dd978_1206c010771
```

This blank line signals the end of the headers and the start of the actual email itself! And we see our `boundary` string here kicking us off.

## On to the content!

The content of a discrete email, e.g. if the `content-type` is `text/plain`, will just dive straight into it. But for multipart emails, we'll get our `boundary` string as above, and we'll go into the different parts of the email.

What's **cool** about MIME parts, is that they can be nested. So you can have a `multipart/mixed` email that, contains a `multipart/alternative` section, with `text/plain` and `text/html`, and an `attachment/pdf` alongside. Emails can therefore look like this:

```
multipart/mixed
  - multipart/alternative
    - text/plain
    - text/html
  - image/png
```

or just:

```
multipart/alternative
  - text/plain
  - text/html
```

or even:

```
multipart/mixed
  - multipart/alternative
    - text/plain
    - multipart/relative
      - text/html
      - image/jpg
  - image/png
  - application/pdf
```

It's up to you! But remember that many clients won't display emails that aren't structured in the common ways above, for example this email structure:

```
multipart/mixed
  - text/plain
  - text/html
  - image/png
```

will not show the image at all in Thunderbird, MS Outlook, iPhone Mail etc. but it will show up in Mail.app and Gmail. So be careful out there.

Like most tech there's a hidden, defacto standard way of doing things. Deviate at your peril!

#### Boundaries again

The boundary is what we use to separate the content. And each piece of content will have it's own boundary, so it really looks like this:

```
---boundary string 1
multipart/alternative
---boundary string 1
  ---boundary string 2
  - text/plain
  ---boundary string 2
  - text/html
  ---boundary string 2
---boundary string 1
```

And now all those funny long strings make sense! Just ensure that they are randomly generated, if someone can guess the boundary string, they could send emails through your system that break out of the boundary, and add their own parts to the email. Scary!

### Attachments

Finally we have attachments, these have their own headers - note the empty line below, after that is where the binary attachment data starts, which is usually Base64 encoded. They are normally thrown into the mix at the end, or inside a `multipart/related` part, if they're intended to be shown inline:

```
----==_mimepart_65c0cd21dd978_1206c010771
Content-Type: image/png
Content-Transfer-Encoding: base64
Content-Disposition: attachment;
 filename=image.png
Content-ID: <65c0cd22f613_1206c010781c@04b539bb-516f-469b-9dcd-f7f12cee6c03.mail>

iVBORw0KGgoAAAANSUhEUgAAAnAAAAD2CAIAAADZBy0YAAAABGdBTUEAALGP
...

----==_mimepart_65c0cd21dd978_1206c010771--

```

# Wrap up

There's even more to write about! The SMTP protocol, SMTP envelopes, STARTTLS, how different clients render emails differently, and more!

Of course, if you want to send emails without knowing about MIME types, it's hard to believe it, but you can! Just send your emails through [MailPace](https://mailpace.com), and we'll do all of this for you (it's hard work, but someone's got to do it!).
