---
title: MP Updates - SMTPUTF8 Support, Smarter Address Validation, and More File Support
publishDate: 2026-08-31T10:00:00.000Z
excerpt: Q3 adds SMTPUTF8 support, stricter RFC-style email length checks, a max total message size guard, stronger recipient-name parsing, and PKPASS support.
category: Changelog
---

This update improves compatibility and reliability in three places that matter during delivery: address validation, recipient headers, and attachments.

## What's New

- Added SMTPUTF8 support for internationalized email addresses where downstream SMTP servers support the extension.
- Improved recipient display-name formatting for names with commas and special characters.
- Fixed edge cases around encoded names and angle-bracket parsing.
- Added stricter SMTP/RFC-style length validation for recipient addresses, including limits for the full address, local part, domain, and domain labels.
- Added a max total email size validation on create with a guardrail of 31,457,280 bytes for message bodies plus attachments.
- Optimized size validation to short-circuit as soon as the total crosses the limit, reducing unnecessary processing on oversized payloads.
- Added support for PKPASS attachments.
