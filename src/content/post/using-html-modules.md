---
title: Modularizing a static website with HTML Modules and PostHTML
publishDate: 2021-06-16T16:00:03.284Z
excerpt: How to enhance a static set of HTML pages with HTML Modules and PostHTML
category: Guides
---

Our landing page https://mailpace.com is a static site that consists of a simple set of HTML pages, with a tiny sprinkling of JavaScript here and there. We started with a single HTML page and for links like our Privacy Policy and Terms of Service, we copied and pasted everything into a new file for each page.

This was fine for a little while, but eventually it became annoying to keep updating each html file, so we wanted to add a way to modularize our pages. The idea is to keep the footer, header, nav bar and other components the same across the site, in a [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) way.

Rather than bring in a new static site framework, we wanted something we could easily add to our existing NPM scripts that we already have for including TailwindCSS and hosting a local dev server.

## Enter HTML Modules & HTML Imports

HTML Modules & Imports are similar specifications that allow splitting up web pages into different HTML components to improve reusability. There are some competing opinions on how these should work and Chromium already has a implementation called HTML Imports.

The W3C have a great explainer here: https://github.com/WICG/webcomponents/blob/gh-pages/proposals/html-modules-explainer.md - but essentially it's a standard that should work well in the same way ES6 modules work well in JavaScript. The alternative to HTML Modules/Imports is to use an HTML templating language - there's lots to choose from, but we felt they were more geared towards injecting data into HTML files, than really modularizing things.

The problem is that HTML Modules / Imports isn't finalised & agreed (and we probably don't need all that ES6 jazz anyway), so how do we add this modular approach to our website?

## How to (sort of) use HTML Modules today on the Server

Although the spec isn't complete there is an implementation of PostHTML (an HTML post-processor, similar to PostCSS) which covers modules, called [PostHTML-Modules](https://github.com/posthtml/posthtml-modules).

This library allows you to Import and process HTML Modules with PostHTML by adding a processing build step to your application pipeline. It's not quite what the W3C has in mind, but looks great for our use case.

## Structuring our pages into HTML Modules

To setup our site we change our pages into a simple HTML structure that combines our standard Layout with our Content. For each page we have a file that looks like this:

```html
<module href="/components/layout.html">
  <module href="/content/content.html"></module>
</module>
```

Where layout.html contains our basic layout and pulls in a Head section, Nav bar and Footer (defined in their own html files).

```html
<!DOCTYPE html>
<html lang="en">
  <module href="/components/head.html"></module>
  <body>
    <module href="/components/nav.html"></module>
    <content></content>
    <module href="/components/footer.html"></module>
  </body>
</html>
```

**The important tag here is `<content></content>` - this will place any code from inside the parent <module></module> tag into this section when the page is rendered, in this case our content.html file.**

The content page can contain any HTML, such as the Landing Page sections, Privacy Policy, Terms of Service etc.

The end result that our compilation step will spit out is a combination of all of these individual modules rendered together, each in their own single page:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    Head
  </head>
  <body>
    <nav>Nav here</nav>
    <div>Custom page content here</div>
    <div>Footer here</div>
  </body>
</html>
```

## Compiling the pages using NPM

We already use NPM to include TailwindCSS and host a simple development server with live reloading, so we'll add compilation of the HTML modules to our build step using PostHTML.

Install PostHTML Modules and onchange (onchange is for watching and rebuilding the pages when developing):

`npm i -D posthtml-modules onchange`

Then create `posthtml.json` in the root of our project:

```json
{
  "input": "html/*.html",
  "output": "public",
  "plugins": {
    "posthtml-modules": {
      "root": "./html",
      "initial": true
    }
  }
}
```

Update our build/watch npm scripts to include posthtml inside `package.json`:

```json
  "scripts": {
    "serve": "cross-env NODE_ENV=development concurrently \"npm run watch:css\" \"npm run watch:html\" \"live-server ./public\"",
    "development": "cross-env NODE_ENV=development npm run build:css && npm run build:html",
    "production": "cross-env NODE_ENV=production npm run build:css && npm run build:html",
    "build:html": "posthtml -c posthtml.json",
    "watch:html": "npm run build:html & onchange \"html/**/*.html\" -- npm run build:html"
  },
```

And that's it! When you run `npm run build:html`, your pages will be compiled to `/public` and from there it's super easy to host on any static provider.
