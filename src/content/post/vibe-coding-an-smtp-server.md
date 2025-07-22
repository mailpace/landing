---
title: Vibe coding an SMTP server in Rust
publishDate: 2025-07-22T22:00:03.284Z
excerpt: How I created an SMTP server for passing emails from SMTP over to HTTPS using Rust, Sonnet 4.0 and VSCode, without writing a single line of code
category: Musings
---

Recently I’ve observed a couple of rare edge-case bugs with our SMTP gateway. But it’s 2025 so instead of attaching a debugger and fixing the root cause, **let’s just vibe code an entirely new SMTP server**. Better yet, let’s use Rust (a language I barely know), and do it in the background while I do other things.

Here’s what I landed with after ~30 prompts, using VSCode and Claude Sonnet 4 https://github.com/mailpace/vibe-smtp  - if you’re curious the prompts are in the git commit history as the git messages, so you can follow along at home too.

I’m neither an AI evangelist, or an AI doomer, I think AI has it's place in the modern development cycle, and anyone who touches code should learn how to be effective with it. Hopefully this helps you!

## What I did

- I paid $100 for a year of Github Copilot Pro
- `mkdir tmp/vibe-smtp && cd vibe-smtp && code .`
- Set the copilot chat to Sonnet 4.0, Agent Mode
- Created a .md file with details of the 
- Typed what I wanted into the chat - this is called "Prompt Engineering"
- Watched what the AI did
- Interrupted it when it went wrong - this is called "Human in the Loop"
- Reviewed the output
- Asked the model to update the output
- Ran `cargo fmt` a few times
- Pushed the code up for you all to see

At no point did I write any code myself.

## Observations 

It does a lot, like it writes a lot of code, markdown files, extra test scripts as well. A bit too eager if you ask me. 

We need to figure out how to improve the workflow and tooling. I feel like I'm making it up as I go along, and it's super easy to get distracted and have to reset your own context when you come back to the computer.

It has issues working with the console (maybe just a VS Code thing), but it often doesn't wait for console outputs for long, starts new things assuming the console was hanging
and doesn't always read the output. On more than one occasion I had to copy console output back into the chat.

It sometimes marked things as TODO, and didn't tell me - or maybe it did, idk.

On the plus side, Rust is quite good for Vibe coding, because of the typing system. It's nice to have a deterministic step after the AI has wrangled with it. More on that later.

It generates so much fucking text. There is no way you can read it all.

Like junior devs, on greenfield pieces it’s great, on well architected code it’s great, but if it’s anything a bit unusual, if changes are nested deep in logic, it starts to go a bit awry. You need to watch out for it getting stuck on compiler errors, conflicting versions etc.

And because it’s quite verbose, and doesn’t understand the meaning you hold in your mind when you write, it’s useless for writing blog posts (honest this is not AI generated...)

## What developers (YOU) need to learn more of:

How to quickly ready code. In fact, I spent more time reading code than anything else on this. The AI will write useless code, decide to mark some things as TODO, use tricks to get the compiler to comply etc. etc.

Testing. e.g. Code coverage, integration, unit tests, performance tests etc. **This is a must have for any vibe coded project**. Put some determinism back in your code. The first thing you should do after the initial scaffolding or feature is add a set of unit tests, integration tests etc. And get into a habit of running them on any change. AI is really good at writing tests, and it's the only way to know that your code is behaving as you expect it to. Ensure that the AI always writes a test for any change, and **read the test details to check that it's testing what you want it to**. 

What good looks like. Check out this refactor https://github.com/mailpace/vibe-smtp/commit/41404e0a96214888bbd900cbafef687b7b4fabbd. You would not know to do this, if you didn't know that one big `main.rs` file is not a great idea. The AI won't tell you, it'll just keep plugging along.

How to debug issues. You can repeatedly prompt the AI when there are problems, but there are always situations where it gets stuck in a never ending loop. Stop the AI when it gets confused, think about it, and then tell it what to do. `git reset --hard` is your friend.

Your toolkit - you need to use git a lot, understand how docker works, be comfortable grepping log files, know what CI is (and use it), understand build steps, transpilation etc. 

Good hygiene - keep your changes small, atomic, and version controlled.

## What you can forget, or at least, slip away

Language syntax, at least you should be familiar with what you know, and what you don’t know, but that's about it.

Boilerplate. Just ask the AI to fill it out.

Idiomatic approaches to implementations, leet code, things like that. Get some pattern recognition on what's good and bad, but don't worry about rote memorizing the best ways to solve problems.

## Finally a public service announcement

READ THE CODE

Set a reminder to READ THE CODE

Do run the code as well, have the AI write some tests that run it for you, fuzz the code, poke it and prod it till it falls over, just remember to READ THE CODE.
