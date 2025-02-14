---
title: How to get emails delivered
publishDate: 2021-10-07T08:00:03.284Z
excerpt: What we do to ensure our email deliverability remains high
category: Guides
---

As a transactional email provider, deliverability is our number one priority. As such we employ a whole bunch of approaches to help ensure our customer's emails get delivered.

If you’re self hosting your own email, or looking to set up an email provider, this list may come in handy.

## 1. Don’t send spam

It seems obvious, but anyone can sign up to an account at MailPace, and even legitimate senders can be victims of spammers. We’ve seen spam coming through contact forms, private message notifications and more. Anything that originates from your IP will be accredited to you, so **if there's anywhere your users can input text, spammers will try to exploit it**. And if your reputation starts to drop, so will your delivery rates.

Here’s what we do to help stop this:

### Spam filter on all outgoing emails

We use [Rspamd](https://rspamd.com/) to filter every email sent through MailPace. Our filters are aggressive and we use the built in Neural network module to learn from spam we see in the wild.

Rspamd can be confusing to configure, if you're struggling, we've previously written about [how to set up Rspamd](https://blog.mailpace.com/blog/how-to-catch-spam-with-rspamd/).

### Whitelisted file extension attachments

We support attachments, but we only support a subset of file extensions ([details in our docs](https://docs.mailpace.com/reference/send/#attachments)), and virus scan them before sending. While not perfect this significantly reduces the risk of dangerous files being sent through our service.

### Proof of domain ownership

Every domain must be verified using [DKIM](https://blog.mailpace.com/blog/whats-a-DKIM-record/). This is both to prove ownership of a domain, but also because most email servers will check DKIM signatures before delivery regardless.

### No free plan

Beware of email providers with free plans. Spammers still bring fraudulent credit cards to the table, but it's much less common.

### Manual review

We manually review all new accounts, and actively disable any we think could be potential spam accounts. When someone signs up with `support@onmicrosoft.com`, you know something's up. We will only reenable these accounts after discussing directly with the customer.

## 2. Be a good citizen

Spammers rarely do all the things that "real" senders do. There are a bunch of things your email server needs to do to fit in with the crowd. Not following these written and unwritten rules will hurt your delivery:

### React to responses correctly

How you react to SMTP responses is important. We parse each response and categorize them, taking action as appropriate. Sometimes this means manual intervention, in other situations we automate the expected behaviour.

Generally the two main categories are:

#### A 4xx error, usually means try again later

Email was designed to work in a world where devices were offline more often than online, so a 4xx error can happen for a whole bunch of transient reasons.

From a deliverability perspective, the most common (especially for low volume senders) is a **Greylisting response**. The server is asking you to wait and resend again in a few seconds or minutes. You must back-off and send again, ideally with an increasing time between each resend. Spammers usually don't follow this kind of instruction, you must.

This is a common reason why emails can be delayed by a few minutes, which can be very frustrating for end users.

#### A 5xx error == don't send to me!

You should not keep trying to send to these hard-bounced addresses. This can happen for a variety of reasons, but in theory it's a permanent error.

> For any hard bounces we automatically add them to a block list and do not send any future emails to this address. Our users can remove emails from this list manually if they are confident the issue has been resolved.

### Handle bounce reports

Sometimes an email will be accepted, but the server will later find out it cannot deliver it. The server will then send a bounce response via email to the `ReplyTo` address. You need to ensure you're able to pick up these bounce reports, parse them and take appropriate action on behalf of your users.

These get mixed up with out of office auto-replies, which can be a real pain to work with.

### Ramp up slow & steady

Don't procure a new IP address and start sending en masse. We rotate IPs into our test pool and warm them up very gradually, before making them available to our customers.

### DKIM

As mentioned above, enable this! All servers will check this.

### SPF & DMARC

You need to enable [Sender Policy Framework (SPF)](https://blog.mailpace.com/blog/whats-an-spf-record/), and it's also helpful to enable [DMARC](https://en.wikipedia.org/wiki/DMARC) if your provider supports it.

### TLS

Support at least TLS 1.2+. TLS 1.1 and below are deprecated, if you want to work with all email servers ever, you can enable them - but at some point we all need to stop this.

### Feedback Loops (FBLs)

Feedback Loops are a mechanism to give email providers and large senders a notification [when a message is marked as spam](https://blog.mailpace.com/blog/what-happens-when-you-send-an-email-to-spam/) by end users. You need to register for them, and then handle any reports or complaints that you receive through the FBL.

### No dedicated IPs

Unless you're sending 250k+ emails/month, from one domain, in a consistent pattern, having a dedicated IP address will hurt your deliverability. This is because your volume will be too low to build a good reputation.

Most email providers will offer dedicated IPs at a very high price - it's rarely worth it.

### Help your users

There are a bunch of things our users can do to help with their specific emails, things like link shorteners, html emails with only images, blocklisted domains in the email content etc. can trip spam filters. We actively review our outgoing spam scores and contact our users if we can help them improve.

## 3. Monitor everything

We run monitoring and anomaly detection on our systems, automatically searching for things like:

- Outgoing email spikes from specific domains
- High spam detection rates or increasing Rspamd scores
- High 4xx and 5xx SMTP responses
- Blocklist SMTP responses
- Long "time to inbox" times for 3x main providers (published on our [landing page](https://mailpace.com/))

Additionally we manually review accounts regularly and monitor external blocklists and deliverability ratings for our IPs and domains. There are even some whitelists out there to get your IP on, which can help.

## Wrap up

As you can see there's quite a lot here, and this is by no means an exhaustive list of all the techniques required to get emails delivered.

If you'd like to take advantage of all the above for your Transactionl Email, without having to do anything yourself, sign up for an account with us: [mailpace.com](https://mailpace.com/)
