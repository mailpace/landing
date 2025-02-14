---
title: Moving Inbound emails out of Beta
publishDate: 2022-01-06T09:15:03.284Z
excerpt: You can now receive emails with MailPace!
category: Changelog
---

Today we're pleased to announce moving our inbound email support out of Beta and making it available to all our new and existing customers.

> Want to get started? Look for the `Inbound Emails` link in your domain at https://app.mailpace.com, and check out the docs: https://docs.mailpace.com/guide/inbound

## Why receive emails with an API?

There are many situations where you might need to programmatically parse and read incoming email. With MailPace you can now setup an inbound subdomain, where all emails received will be parsed, saved and forwarded onto an HTTPS endpoint of your choice.

With this you can build things like: email forwarding services, helpdesks, marketplaces, email bots and more. The possibilities are endless!

We handle all of the email parsing and SMTP connections required to receive the email, so all you need to do is setup your app/service to handle the webhook and your emails will flow nicely through to your application.

## Pricing

Received emails are treated exactly the same as sent emails, so if you're on our base Scaling plan with 10,000 emails, that's 10,000 sent or received emails.

We believe in making all features available to even the smallest senders/receivers, so **all our plans include inbound email support**.

## Receiving with Rails and ActionMailbox

ActionMailbox support is already live in the latest version of our mailpace-rails plugin (v0.3.0): https://rubygems.org/gems/mailpace-rails. Check out the readme for how to receive emails.

### Happy sending (and receiving!)
