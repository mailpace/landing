---
title: What happens when you send an email to spam?
publishDate: 2021-10-20T16:00:03.284Z
excerpt: An overview of what happens when you report an email as spam, and what a Feedback Loop (FBL) is
category: Guides
---

**No matter how good your spam filter is, some emails always get through. Most people will ignore or delete anything that they notice as spam, others will hit the “Report Spam” button. But what does this button do?**

At a minimum most email clients will place the email in a spam folder, a good email provider will also use this information to update their spam detection models and rules to prevent future spam emails from landing in inboxes.

That is helpful for the user and email provider, but what about the person (or machine) who sent the email? If it genuinely is spam, then we don’t care about them. But perhaps the email was miscategorized, or the sender wasn’t aware that it would be considered spam. They need to know if people are marking their emails as spam to correct the issue or stop sending to the address.

Luckily there’s a solution: **Feedback Loops (FBLs)**. These are programs that large ISPs run to send back details of emails that have been marked as spam to the sender.

As an email provider or high volume sender, you register with each major ISP and they will share spam complaints and reports to a Feedback address. As a sender, you can review these reports and block or stop sending to the addresses listed.

There are individual FBL programs at the major providers (Google, Microsoft, Yahoo etc), and https://validity.com has consolidated most of the smaller providers into one system. Reports are usually sent using the [Abuse Reporting Format](https://en.wikipedia.org/wiki/Abuse_Reporting_Format).

So when you hit “report spam”, the following happens:

- The email is moved to the spam folder
- Spam detection systems are updated
- If registered, an email complaint is sent through the FBL programme in ARF format
- The original sender takes action to prevent further spam being sent (in theory)

These final two steps can take a relatively long time to get through (hours or days), and many senders are not registered with the FBL programmes. So to prevent future spam arriving your best bet is to look out for a [List-Unsubscribe](https://www.litmus.com/blog/the-ultimate-guide-to-list-unsubscribe/) link or Unsubscribe link in the email footer, or use a temporary email addresses and turn them off when done.
