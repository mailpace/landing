---
title: Testing Rails Gems against different versions of Rails
publishDate: 2021-04-08T19:00:03.284Z
excerpt: How we discovered the need and found a way to test our Rails Gem against different versions of Rails
category: Guides
---

## Rails changes, our tests stay the same?

Recently we fixed a couple of bugs in our Rails Gem, ran our tests and published a new gem to RubyGems. When we updated our Rails apps with the new gem everything worked well, but suddenly some users started reporting errors, and they needed to rollback to an earlier version.

Upon closer inspection we saw that the issue stemmed from some of the new methods we used for the bug fixes not being available in Rails 5.x. Quickly we patched the Gem by replacing those new methods with standard Ruby code, ran our tests and all was well again.

But our tests were only running against Rails 6.1. No matter how well written, they couldn't ever catch these bugs. **So how do we run these tests against an older version of Rails? And how do we keep doing this in a repeatable way?**

## How we test the Rails Gem

Our Rails Gem is structured with a dummy rails project embedded inside it that our tests run against. When we run our tests it loads up this project, sets MailPace as the default delivery method and runs our tests in the context of the dummy rails app.

To test against different versions of Rails, we need an easy way to change this dummy app's version of Rails, and then re-run our tests against it.

> If we'd done this for Rails 5.x earlier, we would have caught the bugs above! 🤦

## Changing the Rails Version during tests

One obvious answer is to generate lots of different dummy apps and run tests against each of them, but that's not very DRY, and it means it's hard to test different versions on the fly. Unfortunately there are many differences between Rails versions, so its not as simple as changing one variable, there's a little more to it (but not much more as we shall see).

Within our `.gemspec` file we specify a development dependency on Rails, which is merged/installed alongside our gemfile when `bundle install` is executed when installing our development/test environment:

```ruby
spec.add_development_dependency "rails", ">=6.1.3.1"
```

Bingo! **We just need to modify this version on each re-run of the full test suite.**

We use [Circle CI](https://circleci.com/) for testing across our projects at MailPace to ensure our tests are passing on every push and give a public view on our open source components. For our Node.js library we use different Node.js versioned Docker images for each job, however in Rails the Rails version is defined by the project in the Gemfile, which means we can't use a different Docker image to switch Rails version.

# Environment Variables to the Rescue

With CircleCI you can specify environment variables in the config, like this:

```yaml
environment:
  RAILS_TEST_VERSION: '5.2.5'
```

So we created several CircleCI jobs, each with a different `RAILS_TEST_VERSION` to test against.

Then we use some string interpolation to read from this variable (or default to version 6.1.3.1) when installing Rails for the Dummy project:

In `mailpace-rails.gemspec`:

```ruby
spec.add_development_dependency "rails", "#{ENV['RAILS_TEST_VERSION'] || '>=6.1.3.1'}"

```

Finally, we have to modify our dummy project slightly to use the default Application config for the right Rails version:

Inside `test/dummy/config/application.rb`:

```ruby
config.load_defaults "#{ ENV['RAILS_TEST_VERSION'] ? ENV['RAILS_TEST_VERSION'][0..2] : '6.0' }"
```

Which simply says, if the environment variable is set, use defaults from the first three characters (e.g. 5.2.1 becomes 5.2), or use version 6.0.

Now when we run our CircleCI job, we can pick any version of Rails we want just by changing the Environment Variable in the Circle CI config.

All the source code is available here: https://github.com/mailpace/mailpace-rails

And you can see the pipelines here: https://app.circleci.com/pipelines/github/mailpace/mailpace-rails
