---
title: Send attachments with transactional emails
publishDate: 2021-02-18T21:32:03.284Z
excerpt: 📎📎📎 We now support sending attachments over email! 🥳🥳🥳🥳
category: Changelog
---

## You can now send attachments with MailPace!

Based on lots of customer feedback, we've added the ability send attachments over MailPace. We've built support into our Rails and Node libraries, as well as the HTTPS API and SMTP servers.

## How to send an email with an attachment

Here's a simple example in JavaScript, using our NPM library.

```javascript
// Include the OMS library and add the API Key
const MailPace = require('@mailpace/mailpace.js');
const client = new MailPace.DomainClient(api_key);

// Prepare the attachment for sending
const fs = require('fs');
const file_buffer = fs.readFileSync('image.jpg');
const contents_in_base64 = file_buffer.toString('base64');

// Craft the email
const email = {
  from: `test@yourdomain.com`,
  to: 'person@address.com',
  subject: 'Attachment Email',
  htmlbody: '<p>There is an attachment attached!</p>',
  attachments: [
    {
      name: 'image.png',
      content_type: 'image/png',
      content: contents_in_base64,
    },
  ],
};

// Send the email!
client.sendEmail(email);
```

## Limitations

- Total email **size must not exceed 30MB** (including all email content)
- To help prevent the spread of viruses and other malware, **we limit the types of file that can be sent through our system** - you can read more about those here: https://docs.mailpace.com/reference/send#attachments

## Questions, comments?

Contact us at support@mailpace.com
