---
title: Your emails are probably not GDPR compliant
publishDate: 2021-03-25T09:00:03.284Z
excerpt: Sending an email with a tracking pixel is a violation of the GDPR, and more importantly violates recipient's privacy
category: Musings
---

Do you send emails through a service that let's you see if the email was opened?

If so, unless you specifically have an agreement with the recipient to track them you're breaking GDPR and, more importantly **violating the privacy of the recipient**.

## How does email read tracking work?

Email tracking works by abusing HTML emails to embed a link to a tiny, invisible image (the infamous "Spy Pixel"), inside the email. The image is hosted at the email sender's server, and is personalized to the specific email/recipient. When the recipient opens the email the image is automatically downloaded, notifying the sender that the email has been read, along with personal details of the reader (including their IP address, the device the email is being read on, and even a rough physical location).

Link tracking works in a similar way, links in the email are replaced with links that log clicks and then transparently forward the user onto the final destination. Tracking cookies are often added at this stage to gather even more information.

## Why is this a problem?

All of this takes place **without the recipient's knowledge**. Most people have no idea that this is happening. There is often nothing in the UX of most email clients to indicate that a remote resource is being downloaded, and you can't fully disable this behaviour because it has legitimate uses.

We all have a reasonable expectation of privacy with regards to our email habits. If I send an email to someone, I don't have the right to know whether they read it or not, and I certainly shouldn't be tracking it or gathering meta-information around it.

It's not uncommon for unscrupulous senders to see if a recipient opened an email, and send a follow up based on that information, many companies use tracking pixels to enhance their customer profiles, and there are even cases of hackers using spy pixels to uncover an end-users IP address.

## What does the law say?

In the UK and the EU, the GDPR requires organisations to inform recipients of the pixels, and in most cases to obtain consent for them. It's not enough to just have a privacy policy somewhere that details this.

Unfortunately most transactional and bulk-email providers completely ignore this, and enable read and click tracking for all emails by default.

## The moral position

Ultimately, it's not about the law, it's about ethics. If a sender really believes that it's ethical to track users in their inbox, then why not let them know up front in the email itself? Something like:

> Thanks for opening this email. We've logged that you read it, we'll log again next time you open the email. We know where you're located, and what device you're on. We're using this information to tweak our emails to get you to open and read more of our emails in the future

In reality, this is creepy, most people would not want to see this in their inbox.

When you browse a public website, you generally accept being tracked by the website owner, you _begrudgingly_ accept being tracked by 3rd parties. But when you open your emails? It's a private environment, **it should be safe for you to do whatever you want without being tracked**.

## What can you do to help?

Turn off open and click tracking in the emails you send, if your email provider allows you to. If they don't join us at [MailPace](https://mailpace.com) instead - we don't support spy pixels or click tracking, and won't ever support them.

If you're concerned about being tracked in your inbox:

- Install an AdBlocker for web-based email
- Disable automatically downloading images in your email client
- Consider switching to an email provider that actively protects against tracking, such as [HEY](https://hey.com)
