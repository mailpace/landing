---
title: How I learned to stop worrying and love TailwindCSS
publishDate: 2021-10-11T20:15:03.284Z
excerpt: Why TailwindCSS works for me, and a short history of how we all ended up here
category: Musings
---

Many moons ago, when I first started using CSS, it was common to use inline style tags (or maybe I was just inexperienced and didn't know better). My code looked something like this:

```html
<h1 style="margin: 0; font-size: 36px; font-weight: 500; line-height: 1.1;">This is a nice header</h1>
<p style="margin: 0 0 10px; font-size: 14px;">This is a nice paragraph</p>
<a
  style="color: #fff; background-color: #337ab7; display: inline-block; margin-bottom: 0; font-weight: 400; text-align: center; vertical-align: middle; cursor: pointer;padding: 6px 12px; font-size: 14px; line-height: 1.42857143; border-radius: 4px;"
  href="#"
  role="button"
  >A blue button</a
>
```

All the elements are individually styled, which is convenient for minor changes, but quickly becomes hard to maintain, the styles are long, and it's not very DRY (Don't Repeat Yourself). But it did work on MySpace.

Instead we all learnt to do CSS with a separate `.css` file, using .class and #id selectors to select specific elements to apply our CSS to. Like this:

#### index.html

```html
<head>
  <link href="style.css" rel="stylesheet" />
</head>
<body>
  <h1 id="my-very-own-header">This is a nice header</h1>
  <p class="paragraphs-on-app-screen-x">This is a nice paragraph</p>
  <a class="my-blue-buttons">A Blue Button</a>
</body>
```

#### style.css

```css
#my-very-own-header {
  margin: 0;
  font-size: 36px;
  font-weight: 500;
  line-height: 1.1;
}
.paragraphs-on-app-screen-x {
  margin: 0 0 10px;
  font-size: 14px;
}
.my-blue-buttons {
  color: #fff;
  background-color: #337ab7;
  display: inline-block;
  margin-bottom: 0;
  font-weight: 400;
  text-align: center;
  vertical-align: middle;
  cursor: pointer;
  padding: 6px 12px;
  font-size: 14px;
  line-height: 1.42857143;
  border-radius: 4px;
}
```

Suddenly I can **reuse my styles across different elements and even sites and applications**. I also get caching of the `.css` files and lighter HTML. The main downside was that I had to come up with a bunch of different names for each element, and [naming things is hard](https://martinfowler.com/bliki/TwoHardThings.html), especially considering this applies to the entire web page/app.

In 2011 Twitter released [Bootstrap](https://getbootstrap.com/). We could all forget about our `.css` files and just do this in HTML:

```html
<h1>This is a nice heading.</h1>
<p>This is a nice paragraph.</p>
<a class="btn btn-default">A Blue Button</a>
```

And like magic a nice looking page, with sensible defaults appeared on screen. Everyone's website looked the same, but who cares - No CSS, and No Naming Things!

Meanwhile we started to realise that CSS had some intrinsic limits, and we began using pre-processors like SCSS, Less & Sass to make CSS usable. This tied in nicely with the evolution of Javascript libraries requiring transpilation and a general standardization of having some kind of build process for web applications.

We eventually came up with ways to "import" our CSS into our Javascript world of React, Vue et al, in these pipelines, and if we're building a Javascript SPA, we can now easily write CSS inside the JS application code, scoped locally to the current module we're working on with all the goodies our pre-processors provided. There are some cool examples [here](https://cssinjs.org/) and [here](https://github.com/css-modules/css-modules).

But for me, it wasn't quite right:

1. I still had to name elements that deviated from the defaults, even if I wasn't reusing them
2. I was either building my pages up from scratch, or layering on-top of Bootstrap. My sites either looked like everyone else's, or looked terrible / took ages to get right

## Enter TailwindCSS (and other utility libraries)

With [TailwindCSS](https://tailwindcss.com/) we can do things in HTML like:

```html
<h1 class="text-2xl m-0 leading-loose">This is a nice heading.</h1>
<p class="mb-10">This is a nice paragraph.</p>
<a class="text-xl px-8 py-4 font-bold text-white bg-blue-500 shadow-lg rounded hover:underline">A Blue Button</a>
```

Which seems a LOT like where we were at at the start of my journey with inline CSS. Except it’s not- **TailwindCSS out of the box supports a kind of curated, opinionated subset of CSS**, and many of the classes available are **common combinations of CSS rules that make more sense in the context of web design**. We use these to compose our designs based on sensible defaults and pre-configured choices.

> The result is a dramatic reduction in cognitive overhead required to style pages

For example, when I:

- Pick a font size, I choose between two finite values: `text-sm` and `text-xl`, not an infinite `font-size` scale, and even worse between `em` and `px` units
- Choose a a shade of blue, I start with `text-blue-500` and change to `text-blue-600` to darken or `text-blue-400` to lighten. I don't deal with Hex, RGB etc. that require switching context to another tool/concept
- Round an image, I just add `rounded-full`, I don't need to remember that `border-radius: 50%` is the magic CSS way to do this

This means **I now rarely name elements**. I don't have to build a semantic naming structure inside my CSS (which usually evolves into a site/brand specific framework anyway), and my HTML contains everything I need.

I can still extend the defaults with Tailwind, and if I have a specific component I am reusing (less common that you might think), I can use `@apply` to extract styles, or use Template Partials / JS components to reuse my code. Together with all the pre-processing I have to do anyway, TailwindCSS slots into any modern web-app development workflow.

## The beauty of utility-first CSS

Using TailwindCSS means I can stay within my HTML code and get 90% design accuracy from the defaults, without having to name things or build a pseudo-mirror of my HTML in CSS (or vice versa). There's no context switching, no need to try to remember the order of the `margin` property or how to use `box-shadow`.

I just code.
