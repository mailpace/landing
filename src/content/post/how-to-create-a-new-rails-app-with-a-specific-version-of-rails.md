---
title: How to create a new Rails app with a specific version of Rails
publishDate: 2023-09-23T20:00:03.284Z
excerpt: A short explanation of how to create a new Ruby on Rails app with a specific version of Ruby on Rails
category: Guides
---

Imagine you want to try out a new Ruby on Rails version, or have to use an old version for some strange reason.

Here’s how to install an old version of Rails and create a new project with it:

1. Install your chosen version of version of Rails

Take a look at [https://github.com/rails/rails/releases](https://github.com/rails/rails/releases) for all versions, copy the tag name exactly, and add it as the `--version` argument of `gem install rails`

`$ gem install rails --version 7.1.0.beta1`

2. Create a new app with the newly installed rails version:

You do to this by providing the Rails version after `rails` and before `new`, with an underscore in front and after the version. This will look for a railties gem with a matching version and executable rails binary, e.g:

`$ rails _7.1.0.beta1_ new my_app`

And that’s it, your new app awaits.
