---
title: We were right about WebAuthn (passkeys) all along
publishDate: 2026-09-18T18:20:00.000Z
excerpt: Four years after we backed WebAuthn-only 2FA, passkeys have made the same idea mainstream.
category: Musings
---

Back in 2022 we wrote [WebAuthn, and only WebAuthn](/blog/why-we-use-webauthn-for-2fa/) to explain why we shipped 2FA in MailPace without adding TOTP as a fallback.

At the time that felt a little contrarian.

TOTP was everywhere, SMS was still common, and WebAuthn was mostly associated with security keys, weird browser prompts, and long explainers aimed at developers. Our argument was pretty simple though: if you want strong authentication with a good user experience, WebAuthn is where the world was heading.

Four years later, passkeys are basically the industry admitting that WebAuthn won.

## The main thing we got right

The core point in that earlier post was not really about hardware keys, or standards bodies, or whether developers should feel clever for using modern auth. It was that authentication works better when:

- the secret never leaves the device
- the login flow is bound to the real site or app
- the user can authenticate with something they already have
- recovery comes from registering multiple devices, not from copying shared secrets around

That was true then, and it is still true now.

Passkeys did not replace WebAuthn. Passkeys are the product packaging that finally made WebAuthn understandable to normal people. The same underlying approach that once sounded niche is now built into phones, laptops, browsers, and password managers.

That shift matters because most auth technology does not fail on pure cryptography, it fails on adoption. A perfect security system that users avoid is not actually a very good security system.

## Passkeys fixed the naming problem

If you said “WebAuthn” in 2022, most people heard “security feature for experts”.

If you say “passkey” in 2026, most people hear “use Face ID to sign in”.

That is a massive improvement.

One of the awkward things about WebAuthn in the early days was that it was clearly better, but annoyingly hard to explain. Users did not care about attestation formats, public key credentials, or origin binding. They cared that it should be easy, fast, and not break when they changed devices.

Passkeys gave the ecosystem a better story:

- use the device you already trust
- sync credentials where appropriate
- confirm with biometrics or a device PIN
- stop typing passwords into random login forms

None of that changes the underlying security properties we liked before. It just makes the experience legible.

## The anti-phishing argument aged very well

The strongest part of WebAuthn was always phishing resistance.

Shared-secret systems like passwords, SMS codes, and TOTP codes all have the same broad failure mode: users can be tricked into handing them over. Once the secret can be replayed somewhere else, attackers have room to operate.

WebAuthn is different because the credential is tied to the origin. The user can still be socially engineered of course, but the basic “please type your code into this convincing fake login page” attack gets much weaker.

That has only become more relevant. Attack tooling is better, fake login pages are better, and AI has made low-effort impersonation cheaper. In that world, removing replayable secrets from the login flow looks even smarter than it did in 2022.

## We still think optional weaker fallbacks are a trap

This was the spiciest claim in the original post, and we still broadly believe it.

When a product says it supports passkeys but nudges users toward a weaker fallback, the weaker fallback often becomes the de facto default. Product teams tell themselves they are increasing compatibility, but what they may actually be doing is slowing adoption of the better path and expanding the attack surface at the same time.

Of course reality is messy. Account recovery exists. Legacy devices exist. Enterprise environments exist. There are cases where you need additional options.

But the design principle still holds: if you want better authentication outcomes, make the strongest flow the easiest flow.

That is what passkeys have done well. They turned “advanced security option” into “big friendly button”.

## What changed between then and now?

Mostly distribution.

In 2022 the technology was ready before the ecosystem messaging was ready. Today:

- Apple, Google, and Microsoft all support passkeys across their platforms
- password managers have made cross-device use far less awkward
- users increasingly expect biometric login prompts in the browser
- developers no longer have to explain from first principles why this is not just a USB key thing

The cryptography did not suddenly become correct in 2025 or 2026. The user experience, platform support, and terminology finally caught up.

## What we think people should do

If you are building authentication today, start from passkeys/WebAuthn as the desired end state, not as a novelty feature to add later.

That does not mean pretending migration is free. It means:

- make passkeys the primary happy path
- encourage users to register more than one device
- be thoughtful about recovery flows, because recovery is where many systems quietly become insecure
- avoid training users to fall back to phishable shared secrets unless you absolutely must

This was our view when we shipped WebAuthn-only 2FA, and passkeys have only strengthened it.

## So yes, we were right

Not in the smug “we predicted the future” sense, although obviously we will still take the small victory.

More in the sense that the industry eventually moved toward the same conclusion: authentication gets better when you stop centering shared secrets and start using device-bound public key credentials with a clean user experience.

Back then it was called WebAuthn and sounded a bit nerdy.

Now it is called passkeys and everyone loves it.

Same idea though.
