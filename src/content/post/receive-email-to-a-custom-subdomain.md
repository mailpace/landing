---
title: Custom Subdomains for Inbound Emails
publishDate: 2022-06-09T16:15:03.284Z
excerpt: We've launched support for custom subdomains on inbound emails
category: Changelog
---

We have supported [Inbound Emails](https://docs.mailpace.com/guide/inbound/) for several months now, however our original implementation supported only the `inbound` subdomain on your domain. For example, if your domain was `my-awesome-app.com`, you could receive emails to any address `@inbound.my-awesome-app.com` (e.g. hello@inbound.my-awesome-app.com), which would then be forwarded on to an HTTPS endpoint of your choice.

Today **we are rolling out support for Custom Inbound Subdomains - meaning you can choose what the `inbound` part of the email address is**. This means you can have email addresses like `hello@in.my-awesome-app.com` or `hello@inbox.my-awesome-app.com`.

This was one of the most requested features of our Inbound Emails, and we're delighted to bring it live! If you're already using our Inbound Email processing, there is no change or impact to inbound email processing.

To get your inbound email processing setup, open the Inbound Emails section of your Domain dashboard and navigate to the setup section. If you have any feedback or questions, feel free to drop us an email: [support@mailpace.com](mailto:support@mailpace.com).
