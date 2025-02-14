---
title: Should you use a subdomain for sending emails?
publishDate: 2023-01-27T21:15:03.284Z
excerpt: When sending emails from an App, Website or other software, should you use a subdomain? The answer is yes, here's why.
category: Guides
---

# Yes, you should.

Here's why:

Email providers look for indicators and metadata about emails to help inform spam protection and delivery priorities. One of the main indicators they use is the domain, and by extension the subdomain.

Often, you'll want to send multiple different types of emails from the same app, website, or program. For example you might send transactional emails (like account notifications or reset password emails), as well as marketing emails (like newsletters or surveys). You might have emails that contain user-generated content, or contact form submissions with untrusted data.

**By separating our your email streams by subdomain, you're helping to protect the reputation of your most important transactional emails**, that customers need to get immediately.

You’re also less likely to accidentally modify a dedicated subdomain’s DNS records, which can wreak havoc on DKIM signing, DMARC, and SPF policies. This happens more often than you'd think, especially for larger setups.

# But how?

With MailPace it's easy. Unlimited domains are included with all your accounts (including unlimited subdomains), so just create a new subdomain inside your MailPace Organization, verify it over DNS, and use API token associated with that domain for sending.

Got more questions? Contact us (by email of course): support@mailpace.com
