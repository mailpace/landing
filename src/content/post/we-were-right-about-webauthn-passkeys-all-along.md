---
title: We were right about WebAuthn (passkeys) all along
publishDate: 2026-09-18T18:20:00.000Z
excerpt: Four years after we backed WebAuthn-only 2FA, passkeys have made the same idea mainstream.
category: Musings
---

Back in 2022 we wrote [WebAuthn, and only WebAuthn](/blog/why-we-use-webauthn-for-2fa/) to explain why we added 2FA to MailPace without also adding TOTP.

At the time that felt a bit unusual. TOTP was everywhere, SMS codes were still common, and WebAuthn sounded like one of those standards that developers talk about more than normal users.

But the point we were making was simple: if you want the best mix of security and user experience, WebAuthn is a better direction than shared secret based login flows.

Now it’s 2026, passkeys are everywhere, and that view has aged pretty well.

## Passkeys are just WebAuthn with better marketing

The big thing that changed is not really the underlying idea. It’s the presentation.

Back then, “WebAuthn” sounded technical and slightly awkward. Now you can say “passkey” and most people understand it means “use Face ID, Touch ID, Windows Hello, or your phone to sign in”.

That’s a much better story.

The underlying benefits are still the same ones we liked in 2022:

- the credential stays on the device
- the login is tied to the real site or app
- users can sign in with devices they already have
- phishing gets a lot harder

That last point is still the most important one. Passwords, SMS codes and TOTP codes can all be tricked out of users and replayed somewhere else. WebAuthn/passkeys are much better at resisting that kind of attack.

## We still think the UX is better

This was one of our main arguments in the original post, and it still holds.

Good security features need people to actually use them. Passkeys work well because the experience is straightforward. Instead of copying a code out of an app, users can often just approve the login on the device already in front of them.

It also makes recovery less awkward. Rather than relying on one shared secret, users can register more than one device and use whichever one they have nearby.

## What changed since 2022?

Mostly adoption.

Apple, Google and Microsoft all pushed passkeys hard. Browsers support them well. Password managers support them well. Users are much more used to biometric prompts in the browser than they were a few years ago.

In other words, the world caught up.

## So yes, we were right

Not in a dramatic “we saw the future” kind of way.

More that the industry eventually ended up in the same place: authentication is better when you stop relying on shared secrets and start using device-bound credentials instead.

Back then it was called WebAuthn and it sounded a bit nerdy.

Now it’s called passkeys and everyone is much happier with it.
