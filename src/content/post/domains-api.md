---
title: MailPace now has a Domains API
publishDate: 2026-04-21T10:00:00.000Z
excerpt: Programmatically create, verify and manage sending domains with our new Domains API
category: Changelog
---

We've added a long-requested feature to MailPace: a full HTTP API for managing your sending domains.

## What's new?

Until now, adding a new sending domain and managing its DNS verification had to be done through the MailPace web interface. That's fine for a handful of domains, but it doesn't scale when you're:

- Running a multi-tenant SaaS that provisions a dedicated sending domain per customer
- Automating infrastructure with tools like Terraform or custom scripts
- Onboarding users who bring their own domain

With the new Domains API you can now do all of this programmatically.

## What can I do with it?

The Domains API lets you:

- **List** all domains in your organization
- **Create** a new sending domain
- **Show** a specific domain, including its DKIM record and verification status
- **Update** a domain's settings
- **Verify** a domain's DNS records on demand

## How do I authenticate?

The Domains API uses a new **Organization API Token**, which is scoped to your whole organization rather than a single domain. You can create one from your organization settings in the MailPace UI.

Pass it as the `MailPace-Server-Token` header, exactly like our existing API tokens.

## Show me some code

Creating a new domain is as simple as:

```bash
curl -X POST https://app.mailpace.com/api/v1/domains \
  -H "MailPace-Server-Token: YOUR_ORG_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "mail.example.com"}'
```

And you'll get back the DKIM record you need to add to DNS:

```json
{
  "id": 42,
  "name": "mail.example.com",
  "dkim_public_key": "v=DKIM1; k=rsa; p=...",
  "verified": false,
  "created_at": "2026-04-21T10:00:00Z",
  "modified_at": "2026-04-21T10:00:00Z"
}
```

Once DNS has propagated, trigger a verification:

```bash
curl -X POST https://app.mailpace.com/api/v1/domains/42/verify \
  -H "MailPace-Server-Token: YOUR_ORG_TOKEN"
```

## Where can I read the docs?

Full reference documentation, including every endpoint, parameter and error response, is available in our docs:

[https://docs.mailpace.com/reference/domains](https://docs.mailpace.com/reference/domains)

As always, if you run into anything or have feedback, drop us a line at support@mailpace.com.
