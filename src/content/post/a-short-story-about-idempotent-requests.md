---
title: What is an idempotent request?
publishDate: 2024-08-16T08:00:03.284Z
excerpt: A short story about idempotency
category: Musings
image: ~/assets/images/blog/title_cards/a-short-story-about-idempotent-requests.png
---

At MailPace, we recently added support for Idempotent requests, on our `/send` endpoint. If you already know what that is, check out our [Idempotency docs](https://docs.mailpace.com/guide/idempotency/) and go ahead and get started sending with it. If not, read on...

# Idem-what?

Apart from being annoyingly difficult to sound out and consistently spell, Idempotency is the concept that the **same action should not cause the same, repeated behaviour to happen again after the first time.**

It's probably most fun to explain with a short story:

You're staying in a high performant hotel, a hotel where everything is properly engineered for scale. The designers and engineers believe they have thought of everything, they think they know exactly what their guests want and they always deliver it fast. Their systems can scale to thousands of guests per second, even though they only get 1 or 2 guests checking in every hour. Things sometimes go wrong, but it's almost always user error.

You arrive back from a day out exploring, and you really need to go to the toilet. But your room is on the 13th floor, and the lobby toilets are having all of their plumbing replaced and reorganized to make them theoretically easier to maintain, so you quickly rush to the elevator.

You hit the elevator button, it lights up right away. But it's still got to descend from the top floor, and there's no indication of where it is, and you need to go, like now, you're close to wetting yourself. Memories from your eight year old self, of the small puddle of urine pooling across the classroom floor, the complete humiliation and embarrassment of your warm, wet, trousers, visible to all thirty of your mean-spirited classmates swirl around in your head.

So you hit the button again. And again. And again. Spamming it as fast as you possibly can.

The elevator arrives and the doors slowly creep open. You step inside and hit the 13th floor button, and after a moment, the elevator doors slowly close, inching across until they make a seal against each other. You're ready to ascend, you can almost feel the cold porcelain tiles of your hotel bathroom floor waiting for you.

But something's wrong, the elevator isn't moving, and the doors start to re-open back out into the lobby! You reach over to the door close button, but it does nothing, the doors continue to slide all the way open, and stay wide open. You spam it again, and again, desperately hoping the doors close. But the doors stay open, they're not closing! You begin to really panic, your heart is pounding and you're hopping around all over the place.

You realise you can't hold on any longer, the relief must come. A warm feeling in your crotch and a sense of relief waves over you as your body takes over and you let go. You lose the last of your dignity in that hotel elevator, pinned to the ground floor.

Suddenly, in a moment of lucid clarity, you open your eyes wide and declare "Those button presses were not idempotent!!!"
