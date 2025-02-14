---
title: How to embed images in HTML emails
publishDate: 2022-11-11T21:15:03.284Z
excerpt: A guide to the three options for embedding images into HTML emails
category: Guides
---

There’s three ways to send an HTML email with an embedded image. Let’s find out which is best for you and your recipients!

## The three magic options

1. Inline Attachment

This works by attaching the image, then referencing the image in the email with an html image tag.

Most email clients are smart enough to realise that the image...

2. Base64

Base64 is a way of encoding data (any data, including images) into a set of 64 alphanumeric characters. It’s not great at compressing data, but it’s basic character set means that it works well in the text only world of email, and as a result it’s the standard encoding used for all email attachments.

To use it to embed an image, you convert the image to base64, then put the string of text inside the image tag.

It’s ugly, but it works very well

> At Mailpace, all attachments are sent as base64 encoded strings

3. Via URL

Although the methods above can work on the web in general, the way almost all image hosting is done is through…

CDN…

## So what’s the best way to embed an image in an email?

Answer: **Via an externally hosted URL on a Content Delivery Network**

It's almost always the best way, being cacheable, scalable and keeping your email sizes down, it allows users to load images optionally into the email and is usually the fastest to load in their inbox.

Alternative answer: for smaller images, or where you don't have access to an external server / CDN, Base64 encoding them inline is your best bet for cross-client support and
