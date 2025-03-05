---
title: How to embed images in HTML emails
publishDate: 2025-02-24T16:15:03.284Z
excerpt: A guide to the three options for embedding images into HTML emails
image: ~/assets/images/blog/title_cards/how-to-embed-images-in-emails.webp
category: Guides
---

There’s three ways to send an HTML email with an embedded image. Let’s find out which is best for you and your recipients!

## The three magic options

1. Base64 Embedded

Base64 is a way of encoding data (any data, including images) into a set of 64 alphanumeric characters. It’s not great at compressing data, but its basic character set means that it works well in the text-only world of email, and as a result, it’s the standard encoding used for all email attachments.

To use it to embed an image, you convert the image to base64, then put the string of text inside the image tag.

It’s ugly, and you need to repeat the full encoding for each time you show the image, potentially inflating your emails size, but it works, here's an example with a tiny image:

```html
<img
  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=="
  alt="Embedded Image"
/>
```

2. Inline Attachments

This works by attaching the image, then referencing the image in the email with an HTML image tag. Most email clients are smart enough to realize that the image is attached and will display it correctly.

Here’s an example of how to do this using `cid` (Content-ID) referencing, in your email include this line:

```html
<img src="cid:unique-image-id" alt="Embedded Image" />
```

When sending the email, attach the image and set its Content-ID to match the `cid` used in the HTML tag. For example, in a MIME email, the attachment part might look like this:

```
--boundary-string
Content-Type: image/png
Content-Transfer-Encoding: base64
Content-ID: <unique-image-id>

<base64-encoded-image-data>
--boundary-string
```

At MailPace this simple, just include an attachment with a matching CID. Here’s an example using the MailPace API to send an email with an inline attachment:

```bash
curl "https://app.mailpace.com/api/v1/send" \
  -X POST \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -H "MailPace-Server-Token: API_TOKEN_GOES_HERE" \
  -d '{
    "from": "example@domain.com",
    "to": "person@somewhere.com",
    "htmlbody": "<img src="cid:unique-image-id" alt="Embedded Image" />".
    "attachments": "[{ "name": "attachment.jpg", "cid": '<unique-image-id>', "content": "<base64-encoded-image-data>", "content_type": "image/jpeg" }]"
  }'
```

This method is useful because the email is fully self-contained, and images are only attached once but can be referenced multiple times within the email. However, inline images are often not the primary content of the email (so why make your email larger and slower for them?), and many email clients or recipients may block images by default.

3. Via URL (ideally with a CDN)

Although the methods above can work on the web in general, the way almost all scalable image hosting is done is through a Content Delivery Network (CDN). By hosting your images externally and referencing them via URL, you can ensure that your images are cacheable, scalable, and keep your email sizes down. This method allows users to load images optionally into the email and is usually the fastest to load in their inbox.

However, you'll need to host the images somewhere, and there can be privacy concerns with this, such as tracking user behavior through image loads.

## So what’s the best way to embed an image in an email?

Answer: **Via an externally hosted URL on a Content Delivery Network**

It's almost always the best way, being cacheable, scalable, and keeping your email sizes down. It allows users to load images optionally into the email and is usually the fastest to load in their inbox.

Alternative answer: for smaller images, or where you don't have access to an external server/CDN, Base64 encoding them inline is your best bet for cross-client support and reliability.

## Conclusion

When it comes to embedding images in HTML emails, the method you choose will depend on your specific needs and constraints. For most cases, using an externally hosted URL on a CDN is the best option due to its performance and scalability benefits. However, for smaller images or when external hosting is not an option, Base64 encoding provides a reliable alternative. Inline attachments are generally less preferred due to their impact on email size and potential compatibility issues.

Choose the method that best fits your requirements and start sending beautiful, image-rich emails with MailPace today!
