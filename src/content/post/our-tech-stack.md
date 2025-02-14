---
title: Our Tech Stack - boring tech, services not microservices, and no big cloud providers
publishDate: 2023-09-22T17:15:03.284Z
excerpt: An overview of the tech stack that powers MailPace!
category: Musings
---

At [MailPace](http://mailpace.com) we’re focused on a building a simple, low cost service for people to send transactional emails. We’ve built our tech stack with that in mind, around three principles:

1. Use boring tech - we use **things we already know** how to use, that have been proven before
2. Separation of responsibility for our critical components - services, not **micro**services!
3. Avoid the big three cloud providers (Google AWS Azure) - we specifically **avoid cloud-native technologies** (proprietary services that can only be run by someone else), and we like to stick to European providers/locations

We’ve ended up on a fairly stable tech stack, here it is:

## App & API

This is what you hit when you send an email with [app.mailpace.com/api/v1/send](https://docs.mailpace.com/reference/send) or look at your email dashboard at [app.mailpace.com](http://app.mailpace.com)

### Front end and API: Rails

We use [Rails 7](https://rubyonrails.org/), with [Turbo](https://github.com/hotwired/turbo-rails) for the front end JavaScript / interactive parts. Rails is by far the simplest way to get a CRUD app up and running, and has proven itself well.

Yes we could rewrite our API in Rust and be a bit faster (and we might do that in future). But RoR is so easy to add new features, Ruby is a complete joy to write code in, and both Ruby and Rails are getting a lot of updates all the time (but not too many changes, looking at you JavaScript ecosystem).

### Database: Postgres

Just use Postgres, seriously.

### Background Jobs: ActiveJob with Sidekiq and Redis

[Sidekiq](https://github.com/sidekiq/sidekiq) runs a job for all our outbound emails and many other background jobs, using [Redis](https://redis.io/) to store the details and state of the job. Again this is proven, easy to use tech.

### Hosting: Clever Cloud

All of this is hosted on [Clever Cloud](https://clever-cloud.com/) in Paris, with GitHub based deploys from master branch, via a Dockerfile.

This means we don’t handle any operations infra, so if our Rails app needs to scale we let Clever Cloud handle all the load balancing, horizontal and vertical scaling etc.

The downside of this is a lack of tuning for performance or quality of life improvements (e.g. our deployments take longer than we'd like, maintaining the database requires support from them, we're reliant on their setup of VMs etc.) but overall a worthy trade off.

## SMTP Servers

Naturally, we run several SMTP servers for sending emails, receiving emails, and for our SMTP gateway at `smtp.mailpace.com`.

### Inbound SMTP & SMTP Gateway: JavaScript

We have our own custom written JavaScript SMTP Servers, which are very lightweight and can easily scale to thousands of emails/second. We use JavaScript because a) we know it well and b) node.js is reasonably fast / lightweight for handling async processes.

These are hosted on [fly.io](http://fly.io), and use `fly deploy` for deployments, based on a Dockerfile. The Fly VMs are really lightweight and deployments are super fast, as well as fully managed.

### Outbound SMTP: ZoneMTA (JavaScript)

We do like to send lots of emails, so here we chose JavaScript again as we found that [ZoneMTA](https://github.com/zone-eu/zone-mta) was by far the easiest Mail Transfer Agent (MTA) to write plugins for and configure. This means we can pull DKIM keys in real time, run spam checks, update our database on emails being sent/bounced etc.

Our outbound emails are hosted on Ubuntu VMs from [Freethought](http://freethought.uk/) with deployments based on [Capistrano](https://capistranorb.com/). These rarely change, so we're happy with simple, old school server management for these servers.

## The bits in between: HTTP Services

We use HTTP RPC calls to send/receive data between services. This gives us a bit of freedom and resiliency between components. We know HTTP well and it’s trivial to work with in any language.

We operate Redis caches between HTTP services for speed/resilience, here's [how we do that](https://blog.mailpace.com/blog/caching-http-requests-between-services/).

## File Storage

### Backups: Clever Cloud and AWS S3

We have backups at regular schedules from Clever Cloud and also an additional backup to AWS S3, using [the backup gem](https://github.com/backup/backup).

And we have tested our restore process :)

### Attachment storage: Clever Cloud Cellar

Cellar is an S3 equivalent from Clever Cloud. We wrote about [how we moved from Postgres to Cellar for attachments here](https://blog.mailpace.com/blog/we-used-to-store-files-as-strings-in-the-database-but-no-more/).

## Static Sites

### This blog: Gatsby

You’re probably reading this on [Gatsby](https://www.gatsbyjs.com/) , which is (was?) a react-based static site generator. I think it’s now some kind of JS framework. It works well, but actually is a complete pain to set up and always has some kind of dependency issue whenever we try to run it locally. This is one area where we think there are faster to set up/easier to maintain alternatives for a blog, but it works and we dare not touch it for fear of it breaking.

All the blog posts are written in [markdown](https://www.markdownguide.org/) so we could easily switch to something else if we wanted to.

### Docs: Docusaurus

Our [documentation pages](https://docs.mailpace.com) are super important, we’re using a project that came out of facebook, [Docusaurus](https://docusaurus.io/), it’s very easy to work with and is also built around markdown files.

We have [Algolia](https://www.algolia.com/) for search baked in, straightforward to setup and works well.

### MailPace.com - HTML Modules + TailwindCSS

This is probably the simplest part - we started with HTML, with a sprinkle of JavaScript. Then added [HTML Modules using npm scripts](https://blog.mailpace.com/blog/using-html-modules/ 'smartCard-inline') and added TailwindCSS. It’s perfect and easy to maintain.

### Hosting: Netlify

We use [Netlify](http://netlify.com) to host these static sites. Very easy to set up, deploy straight from github. There are plenty of options here, e.g. github pages, vercel etc.

## Automation

We have a separate VM for running [Cron](https://en.wikipedia.org/wiki/Cron) jobs. We use it to also send out emails to ourselves regularly using the greatest transactional email API available, our very own [mailpace.com](http://mailpace.com), and we previously wrote about [why sending emails is a great way to monitor your app](https://dev.to/ehlo_250/the-easiest-way-to-monitor-your-app-in-production-is-email-1c4h).

We automate our SMTP cert renewal (surprisingly complex) with fly.io machines, here’s [how we did that](https://blog.mailpace.com/blog/fly-machines-automating-certificate-upgrades-for-smtp/).

## Other Services

- [Paddle](http://Paddle.com) for payments and checkout - they act as a merchant of record, and this means we don't have to worry about collecting taxes, VAT, or any of that stuff
- [Plausible](http://Plausible.io) for user analytics - only on the static sites, **not** on the app, we don't track that anywhere outside of server logs and database changes
- [AppSignal](https://www.appsignal.com/) for Error and Performance monitoring - they offer a lot of pieces
- [VSCode](https://code.visualstudio.com/) (with Github Copilot) for writing code
- [Masto.host](https://masto.host) for Mastodon (Social media) - essential given Twitter's current state
- [Letsencrypt](https://letsencrypt.org/) for SSL Certificates
- [Cloudflare](http://Cloudflare.com '‌') for DNS and CDN on static sites
- [Github](http://github.com) for git hosting
- [Trello](http://trello.com) for task management
- [Tutanota](https://tutanota.com) and [Hey](https://hey.com) for "normal" emails

---

Phew! I think that’s everything. I guess it's not as boring/simple as I thought before I started writing this!

Oh I forgot, we use [MailPace](mailpace.com) for transactional emails, naturally. And we don't send marketing emails in case you were wondering what we use for that!
