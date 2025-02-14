---
title: WebAuthn, and only WebAuthn
publishDate: 2022-05-24T20:15:03.284Z
excerpt: Why we implemented WebAuthn for Two Factor Authentication
category: Changelog
---

Recently we added Two Factor Authentication (2FA) support to [MailPace](https://mailpace.com). It was long overdue, with many of our customers requesting it regularly. This post is about the options available in 2022 and why we went with WebAuthn, **and only WebAuthn**.

We started with an assumption that plain old [Time-based One Time Password (TOTP)](https://en.wikipedia.org/wiki/Time-based_one-time_password) would be the right choice here, after all it’s the most common 2FA approach, reasonably secure, almost every service with 2FA supports it, and there are numerous iOS and Android apps for storing the shared secret, as well as browser extensions. To be honest, if enabling TOTP 2FA was as simple as flipping a switch, we would have enabled it and been done with it. But when researching how to get setup with Devise and Rails, it wasn’t immediately obvious which library/approach to take, so we did some more reading on the other 2FA options available.

Naturally we know not to offer SMS based 2FA, one because there are numerous cases of SMS based attacks, and two, we don’t want to store or require phone numbers, it’s against our privacy policy of storing the least amount of user data possible, and phone numbers are a particularly invasive vector.

Email 2FA, with One Time Passcodes would make sense given we are a transactional email company- but it’s an awkward flow, introduces dependencies on mailbox providers (something we know a lot about) and is arguably not that secure or really a second factor. If your email address is compromised, an attacker can do a password reset and get straight through the second factor.

We did not consider push-based 2FA at all, these require proprietary services and 3rd party apps to work, and the user experience is clunky.

As we read more and more about these options, WebAuthn started to pop up. We recalled reading about this standard a couple of years ago, we remembered our rarely used FIDO Yubikeys, (used even less now MacBooks only come with USB-C ports) and reminded ourselves that we could sign git commits, do password-less logins and 2FA with these magic devices. You plug them in when logging in, and with some cryptographic magic you’re authenticated, and they can’t be phished, hacked or otherwise broken. Amazing.

> But hardly anyone has hardware tokens, right? And very few services support them?

Well it turns out that a standard that links together browsers, logins and hardware was introduced a few years ago to help here, called [WebAuthn](https://webauthn.guide/), and it's been approved as [the W3C standard for authenticating users with public keys](https://www.w3.org/TR/webauthn-2/). Adoption has grown a lot recently, with TouchID, FaceID, Windows Hello, and Android devices now supported, along with a whole bunch of other “Credentials”, as well as FIDO tokens (e.g. Yubikeys). The standard is implemented in most modern browsers - almost 90% according to [Can I Use](https://caniuse.com/?search=webauthn). If the device you’re reading this on is reasonably modern, you can probably authenticate with WebAuthn right now.

It took a while to understand how or whether the user experience could work for us, most of the WebAuthn explanations are focused on the developer experience, or talk about the complex client-server dance during the auth process. So to test it we implemented it as a 2FA flow, where users can register credentials in our app, and use them to authenticate after providing their password.

It turns out that the User Experience is also really nice.

You can register as many “Credentials” as you like. E.g. I have 2x Yubikeys, a MacBook (TouchID) and an iPhone (FaceID) all registered, so I can login from all of my devices, and recover from any loss of an individual key. And the Authenticate button will work with any of them, without the user needing to pick which one.

But what about our old friend TOTP, why not add that on as well? Well almost all of our customers are developers, and they tend to have modern devices and Yubikeys already. But more importantly, WebAuthn is the future, it’s a much better UX, works almost everywhere and is the most secure way to implement 2FA- the only thing standing in the way is mass scale user adoption. **If we implement TOTP as well, fewer people will use WebAuthn**, and in a very small way, we will be contributing to slower adoption of WebAuthn.

Here’s to the future! If you’d like to setup 2FA with WebAuthn on your MailPace account, login and navigate to Account in the top right and scroll down to the 2FA section.

There’s an incredible article with details on [how to implement WebAuthn in Ruby on Rails](https://www.honeybadger.io/blog/multi-factor-2fa-authentication-rails-webauthn-devise/) from [Honeybadger.io](https://honeybadger.io) and [@citronak](https://twitter.com/citronak), which includes working code examples, so we won't discuss how we implemented it here.

If you have any feedback or questions on this, feel free to drop us an email: [support@mailpace.com](mailto:support@mailpace.com).
