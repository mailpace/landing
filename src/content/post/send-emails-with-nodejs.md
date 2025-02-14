---
title: Send transactional emails with Node.js over MailPace
publishDate: 2021-02-04T22:12:03.284Z
excerpt: Node.js package launch 🚀
category: Changelog
---

We're pleased to announce the availability of our open source Node.js package for sending emails over MailPace.

This is probably the **easiest way to send transactional emails from Node.js!**

The npm package allows you to send emails in a couple of lines of code, it's a simple as creating a client with your API token, and calling `sendEmail` with your email contents (see here for a full list of email properties: https://docs.mailpace.com/reference/send):

```javascript
const MailPace = require('@mailpace/mailpace.js');
const client = new MailPace.DomainClient('API_TOKEN_HERE');

client.sendEmail({
  from: 'test@test.com',
  to: 'test@test.com',
  subject: 'test',
  htmlbody: '<H1>HTML Email</h1>',
});
```

The package is available on npm here: https://www.npmjs.com/package/@mailpace/mailpace.js

Source code here: https://github.com/mailpace/mailpace.js

And finally the docs: https://docs.mailpace.com/integrations/node

If you don't have an OMS account, get one set up today: https://app.mailpace.com/users/sign_up

Happy sending!
Paul.
