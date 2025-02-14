---
title: 'Deploying Rails with Docker'
publishDate: 2023-09-23T22:12:03.284Z
excerpt: 'What the new Dockerfile available in Rails 7.1 will mean for Rails deployments'
category: Guides
---

Rails 7.1 is right around the corner, and while deploying Rails with a Dockerfile has always been a thing, the Rails team have decided to give Dockerfiles a big, warm hug, with a Rails Dockerfile built into new Rails projects by default.

## What is a Rails “deployment”?

Rails is an opinionated stack, and the “traditional” Rails deployment comes batteries-included. Rails apps generally expect these components to be available, just an Environment Variable away, so deployments must include things such as background job processors, key-value stores, image processors etc. **by default**.

This is contrast with e.g. a node.js app, where you might have only one main component by default in your app, and slowly build up your stack by adding components one by one.

This is a philosophical debate, do you want an opinionated stack that’s fast to get started in, or do you want to choose every piece yourself? There’s no right or wrong answer.

> Although in my opinion anything that reduces your cognitive load so you can focus on your problem domain is worth it, so Rails wins for 99% of CRUD apps

Given this, **the default Rails deployments have typically involved deploying a bunch of components (e.g. Ruby, Redis, Sidekiq, ImageMagik etc) on a Linux VM or server, manually or automated with something like Ansible**. Or perhaps using a PaaS like Heroku with everything pre-configured for you.

But we live in a world of containers now, where servers are cattle not pets, and everything is stateless and ephemeral, so what does that mean for Rails?

## Enter Containers

Containers are essentially an (almost) isolated runtime for your environment, and Dockerfiles have become the standard way to define them. You use the Dockerfile to specify the container in a declarative way, typically to set up all the dependencies and basically get your app environment lined up in a repeatable way that can run anywhere you like.

Containers usually only run one process at a time, and although you can run more if you want, **it’s not what you’re supposed to do with them.**

A containerized Rails deployment will therefore mean several containers, linked together with Docker Compose or similar tech. You’ll have a container for [Sidekiq](https://github.com/sidekiq/sidekiq), one for [Redis](https://redis.io/), another for Rails itself, and then one for your load balancer, possibly one for your database, and for other infrastructure. It gets complex fast!

Components like Sidekiq also need to include your source code in them (they run active jobs from your codebase, access rails models directly etc.). It can therefore be tempting to run Sidekiq inside the same container as the Rails app, which can save costs and seems simpler at first. For some folks, lining everything up all of this can be a bit annoying, versus just provisioning a VM with everything set up there.

> This is probably why most articles on how to deploy a Rails app today cover deployments on PaaS providers (Heroku, Fly.io etc.) or onto pet-like VMs, and not containers

The new Rails Dockerfile only covers the Rails part,you’ll still need to set up this other stuff, but because every Rails app will now have a standard Dockerfile, we’re confident that deploying Rails via a container will become the default approach most teams pick, and any solutions for tricky problems that crop up will be shared by the community.

## The new Rails Dockerfile

When you create a new Rails app from 7.1 onwards you’ll see three new files:

- `Dockerfile` - which is the main container definition for the app, and actually runs the app
- `bin/docker-entrypoint` - a shell script used by the Dockerfile to run database migrations with `rails db:prepare`
- `.dockerignore` - used to avoid including temporary and unnecessary files in the container

The templates that generate these files are here: [github.com/rails/rails/railties/lib/rails/generators/rails/app/templates](https://github.com/rails/rails/tree/ef6c3fb4bf43119385ad0dd04b42eb5cd0d9fb93/railties/lib/rails/generators/rails/app/templates)

Here’s an example from a fresh Rails 7.1 App, from the `7.1.0.beta1` release. Thanks to the code comments this is pretty self explanatory, but in summary this will:

1. Get the `slim` Ruby image from Docker Hub
2. Configure environment variables for production
3. Set up a build stage to install packages, build gems, precompile code, and assets.
4. Copy the application code over to the container
5. Create a final production image with additional packages, copying built artifacts, and configuring a non-root user to run the app
6. Execute the `ENTRYPOINT` bash script for database preparation and start the Rails server on port 3000 via `CMD`

> Note `ENTRYPOINT` is always run, but `CMD` is only run if no other command is specified at runtime - i.e. you can easily override `CMD` by passing a command to the container at runtime`

```dockerfile
# syntax = docker/dockerfile:1

# Make sure RUBY_VERSION matches the Ruby version in .ruby-version and Gemfile
ARG RUBY_VERSION=2.7.6
FROM registry.docker.com/library/ruby:$RUBY_VERSION-slim as base

# Rails app lives here
WORKDIR /rails

# Set production environment
ENV RAILS_ENV="production" \
    BUNDLE_DEPLOYMENT="1" \
    BUNDLE_PATH="/usr/local/bundle" \
    BUNDLE_WITHOUT="development"

# Throw-away build stage to reduce size of final image
FROM base as build

# Install packages needed to build gems
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential git libvips pkg-config

# Install application gems
COPY Gemfile Gemfile.lock ./
RUN bundle install && \
    rm -rf ~/.bundle/ "${BUNDLE_PATH}"/ruby/*/cache "${BUNDLE_PATH}"/ruby/*/bundler/gems/*/.git && \
    bundle exec bootsnap precompile --gemfile

# Copy application code
COPY . .

# Precompile bootsnap code for faster boot times
RUN bundle exec bootsnap precompile app/ lib/

# Precompiling assets for production without requiring secret RAILS_MASTER_KEY
RUN SECRET_KEY_BASE_DUMMY=1 ./bin/rails assets:precompile

# Final stage for app image
FROM base

# Install packages needed for deployment
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y curl libsqlite3-0 libvips && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

# Copy built artifacts: gems, application
COPY --from=build /usr/local/bundle /usr/local/bundle
COPY --from=build /rails /rails

# Run and own only the runtime files as a non-root user for security
RUN useradd rails --create-home --shell /bin/bash && \
    chown -R rails:rails db log storage tmp
USER rails:rails

# Entrypoint prepares the database.
ENTRYPOINT ["/rails/bin/docker-entrypoint"]

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000
CMD ["./bin/rails", "server"]
```

## What about Sidekiq, Redis, Cron Jobs, etc.?

For Redis, Postgres or anything that does not depend on your Rails application code, there are standard containers you can pull down and run, and you can use something like Docker Compose to link them together.

But for Sidekiq or Cron Jobs you need to keep your Rails code around. In that case you could either:

- Override `CMD` at runtime to run Sidekiq / Cron instead of Rails e.g. `docker run myapp bundle exec sidekiq`
- Have a separate Dockerfile for Sidekiq that uses a similar base image as above, but with a different `CMD` e.g. `CMD ["./bin/bundle", "exec", "sidekiq"]` - this is a bit strange as you're duplicating the base image, but it's a simple solution

This way you can run the code in a separate container, but still have access to your application code.

But this is just the start - to run in production there's much more to consider (SSL termination, Load Balancing, Horizontal Scaling, etc.)

## Actual Production Deployments

If you're a Rails developer you're probably focused on building a great product, so you don't want to spend your time learning DevOps and setting up your infrastructure - which your users don't care about, ever.

The good news is that Basecamp have released [Kamal](https://github.com/basecamp/kamal) (formerly called MRSK), which simplifies running Rails apps on your own hardware, or on IaaS providers like Hetzner and Digital Ocean. It uses containers and includes things like zero downtime deploys via blue/green deployments. You'll still want a Load Balancer + SSL Termination in front, so you'll need to set that up separately or use a Cloud Provider with it built in already.

A more turnkey PaaS like [Fly.io](https://fly.io) can get you up and running with Rails very quickly too, and is kind of a spiritual successor to Heroku.

There are also cool options like [HatchBox](https://www.hatchbox.io/) that can use any Ubuntu machine to get a Rails app up running quickly, with everything you typically need baked in.

So it looks like the Pet Server approach for deploying Rails Apps is finally going to die out. But it does feel like there's a gap in examples, tutorials and services for deploying Rails apps with containers. Fingers crossed that Rails 7.1's Dockerfile will change this.
