---
title: MailPace now supports webhooks
publishDate: 2021-11-16T17:00:03.284Z
excerpt: We've added webhook support for emails
category: Changelog
---

We've added a long-requested feature to our service:

[Webhooks](https://en.wikipedia.org/wiki/Webhook)

# What are Webhooks?

Webhooks are HTTP requests automatically triggered by a service to an endpoint of your choice. You can use them to keep track of events and actions happening in an application or service, and they are crucial for integrating between applications online.

Webhooks are typically sent as HTTP POST requests with a JSON body, and contain detailed information about the event that occurred.

# What webhooks do you support?

All of the email [event lifecycle](https://docs.mailpace.com/guide/lifecycle/) statuses are supported.

# How do I get setup?

As a developer, you'll need to setup an endpoint to listen to events from our API, and then you can enable the webhooks you want to monitor from the MailPace UI, in your Domain.

For more details check out our Docs on webhooks over here: https://docs.mailpace.com/guide/webhooks
