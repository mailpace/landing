---
title: How to create a simulation of a terminal
publishDate: 2023-10-31T22:15:03.284Z
excerpt: A guide to creating a simple Terminal Simulation in the browser using Tailwind CSS and JavaScript
category: Guides
---

When demonstrating an API or similar service, your landing page should show how it works! You can [easily use something like PrismJS to add syntax highlighting to your code snippets](https://blog.mailpace.com/blog/adding-code-syntax-highlighting/), which looks neat. But what about creating something a bit more compelling for the Hero unit of your landing page?

It needs to be simple and clear, and not necessarily syntactically correct, but it should look like a terminal, complete with a blinking cursor and simulated text entry. Something like this:

![A simulation of a terminal in the browser](~/assets/images/blog/terminal-simulation-in-browser.webp)

With the the help of [TypedJS](https://github.com/mattboldt/typed.js/) and [TailwindCSS](https://tailwindcss.com/) this is actually really easy.

## Dependencies

Let's start by including TailwindCSS and Typed.js in our HTML `<head>` element:

```html
<head>
  ...
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/typed.js@2.0.16/dist/typed.umd.js"></script>
</head>
```

_Note that you might want to use a pre-processor/build step or similar in production, and load them async etc._

## Our Terminal window

We'll start by creating a `<div>` element with a class of `terminal-window` and a `<pre>` element with a class of `terminal-output`:

```html
<div class="terminal-window">
  <pre id="terminal-output"></pre>
</div>
```

Then let's style it a little with TailwindCSS, and add a close button, so it looks a bit like a terminal:

```html
<div
  class="terminal-window mx-2 w-full xl:w-4/5 p-6 text-base sm:text-sm md:text-base rounded-md shadow-2xl bg-gray-800 max-h-80"
>
  <div class="relative">
    <div class="absolute -top-5 -right-5">
      <!-- Close button -->
      <button title="Close" class="text-gray-600 w-8 h-8 rounded-full flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-4 h-4">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>
  </div>
  <pre class="text-gray-300 whitespace-pre" id="terminal-output"></pre>
</div>
```

## Sprinkle a bit of JavaScript

First initalize TypedJS, targeting `terminal-output`:

```js
const typed = new Typed('#terminal-output', {
  strings: [textToType],
  typeSpeed: 20,
  loop: false,
  cursorChar: '_',
});
```

Next we'll write the text we want to show, it's a bit awkward but it's kind of like a mini Domain Specific Language:

```js
const textToShow =
  '$ curl <span class="text-white">https://app.mailpace.com/api/v1/send</span>\n -H MailPace-Server-Token: a3c4-efg6 \n -d {\n    from: awesome@developer.com,\n    to: important@users.com,\n    subject: Woah, MailPace Rocks!\n} \n\n`<span class="text-gray-500">Sending...</span>`\n^250<span class="text-green-200">✓ Email Sent!</span>';
```

- ^ followed by a number means to pause by that number of milliseconds, e.g. while simulating a network call
- Anything wrapped in backticks is output from the terminal
- \n is a line break
- We we can embed `<span>` elements to give us basic syntax highlighting

Note that this curl example isn't working code, we just want to represent a simplified version for our viewers to understand what's going on. If we add all the pieces needed for it to work, it's not as clear what's going on.

## Add some animation

Not strictly necessary, but let's add a little bounce when our users open the site, to kick start the typing:

```html
<style>
  @keyframes softBounce {
    0%,
    20%,
    50%,
    80%,
    100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-30px);
    }
    60% {
      transform: translateY(-5px);
    }
  }

  .terminal-window {
    animation: softBounce 1s ease-in;
  }
</style>
```

And we're done! Check out the working version here: https://mailpace.com
