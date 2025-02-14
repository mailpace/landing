---
title: How to catch spam with Rspamd
publishDate: 2021-03-17T17:00:03.284Z
excerpt: A simple guide to configuring the basic settings for the spam filtering system Rspamd
category: Guides
---

## What is Rspamd?

[Rspamd](https://rspamd.com/) is a powerful email spam filtering system. It's fast, open source, and supports a huge number of features - and it's extremely good at identifying spam.

You can use Rspamd to filter emails coming into your network / application, and either block them completely, or flag them as potential spam (e.g. to put them in user's spam folders). Checking outbound email is also supported (in fact, that's what we use it for at [MailPace](https://mailpace.com), and this helps ensure users aren't accidentally sending spam (e.g. via a hacked account).

Rspamd is very, very configurable, and due to it's vast surface area, plugins and scope it's not easy to understand how to configure it, which means most people end up with the default configuration. Fortunately once you know how, it's not difficult to configure and enhance to capture even more spam.

## How Rspamd works

Rspamd runs as a background process on your system. It's a standalone C / Lua program, and has an HTTP API to check emails against. You can easily expose it on your internal network or send requests to it locally from almost any application. There are [integrations available for some MTAs](https://rspamd.com/doc/integration.html) to help, and you can also send requests directly (e.g. see this [node.js ZoneMTA Rspamd plugin](https://github.com/zone-eu/zone-mta/tree/8b8efd9f5b5365e1408a9a4fef6c630469506cf1/plugins/core/rspamd) for reference)

Rspamd takes an email, runs it against a set of **Modules**. Each module has **Tests** which update a **Symbol** (an uppercase variable name/string) with a score. The aggregation and actions triggered by these scores forms whether the email will be marked as spam or not.

There are 20+ Modules with hundreds of Tests and Symbols. And you can even write your own Modules, Tests and Symbols to customize and extend Rspamd. You can even recommend actions somewhere between spam and not spam (e.g. greylist and ask the server to resend the email at a later date).

## Configuring Rspamd

The default Rspamd configuration works well out of the box, and will block a lot of spam. It is over 2000 lines in total, so it's broken up into lots of small individual files/folders within the Rspamd configuration directory.

> Hint: On an Ubuntu install the default configuration directory is `/etc/rspamd`

### Checking your current configuration

To understand exactly what's running it's beneficial to see the full configuration file. This command will dump the full config to a file in your home directory:

`rspamadm configdump >> ~/rspamd_config`

I strongly recommend reading through that configuration file with the documentation side-by-side to understand all of the options enabled.

### Making changes and enhancements

To change the settings, you create a new file in the `local.d` folder **with the same name as the configuration file for the module you wish to change** or enable. Any configuration settings that you add to this file will override the default settings when Rspamd runs.

For example, on Ubuntu, to allow Rspamd to listen on external interfaces and be callable from another server, create the file `/etc/rspamd/local.d/worker-normal.inc`

with contents:

```
bind_socket = "0.0.0.0:11333";
```

And to completely disable a module add:

```
enabled = false;
```

### The different modules available

The main modules have been neatly categorized over at the [alternative introduction to rspamd configuration](https://www.0xf8.org/2018/05/an-alternative-introduction-to-rspamd-configuration-modules/), and you can see a full list of modules in the [module documentation](https://rspamd.com/doc/modules/).

For us the most important module is the Multimaps module, read on for an example.

## Catching spam with Rspamd Multimaps & Regular Expressions

One common use case is to catch specific strings with a regular expression. This can be really useful if the same spammer is attacking you, and you can easily recognize their messages based on a regular expression.

To do this we configure the [Multimap Rspamd module](https://rspamd.com/doc/modules/multimap.html). This module allows you to load dynamic rules as "maps" that can be updated without changing rspamd itself - you can have local maps or remote maps on different servers. And there are many public spam maps out there already that you can download over HTTP.

Here's an example that uses the Multimap module to create a new **Symbol** (`KNOWN_SPAM_STRING` in this case) which will mark any matching email as Spam and recommend rejection.

On Ubuntu, we create the file `/etc/rspamd/local.d/multimap.conf` with the following contents:

```
KNOWN_SPAM_STRING {
    type = "content";
    filter = "body";
    map = "${LOCAL_CONFDIR}/maps/known_spam.map";
    prefilter = true;
    action = "reject";
    regexp = true;
}
```

Breaking this example down:

- `KNOWN_SPAM_STRING` is the symbol name, this can be anything you like, and you will see this name when you see a report / response from Rspamd
- `type = "content";` means we're matching against the email contents
- `filter = "body";` means look only in the raw undecoded body of the email (i.e. ignore headers)
- `map` is the path to the map file where the rules are contained(see below)
- `prefilter` allows us to add the action parameter, and specific a specific action to take if this map matches
- `action` - this is the default action to apply. Reject means drop the message, other options are accept, add header, rewrite subject and greylist
- `regexp = true;` means that this map contains Regular Expressions

Then we create a file called `known_spam.map` in the `maps` folder with our list of regular expressions, e.g.

```
/spam string/gi
/another spam string/gi
```

Now any email that matches these regular expressions (e.g. has "spam string" in it) will be marked as REJECT.

## How we automate configuration updates

At MailPace we use [Capistrano](https://capistranorb.com/) for deployments, so when we update our mail servers we have a task that runs the following command after deployment to update rspamd rules:

```
execute 'sudo cp -r /home/user/mailer/current/rspamd/local.d/* /etc/rspamd/local.d/ && sudo systemctl restart rspamd'
```

This copies the configuration files from our git repository and restarts the Rspamd daemon.

## How we update Rspamd with user and system flagged spam

Sometimes our filter doesn't quite catch everything and we receive a spam report from another server or a user. In those cases we automatically update Rspamd using the the `/learnspam` API endpoint.

This endpoint updates the [Bayes classifier](https://en.wikipedia.org/wiki/Bayes_classifier) inside Rspamd, and helps improve the spam detection for similar emails.

All you need to do is pass the message to the `/learnspam` endpoint of the Rspamd Worker over an HTTP request (usually running on port 11333).

## Summary & Further Reading

As you can see there's lots you can do with Rspamd - listed above is just a tiny subset of what's available. To learn more check out the following links, or reach out to us at support@mailpace.com

- [Rspamd Official Documentation](https://rspamd.com/doc/index.html)
- [An alternative introduction to rspamd configuration](https://www.0xf8.org/2018/05/an-alternative-introduction-to-rspamd-configuration-introduction/)
