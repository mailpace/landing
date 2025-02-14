---
title: Database Outage - Post Mortem
publishDate: 2023-08-30T16:00:03.284Z
excerpt: A post mortem on a recent two hour outage for our API and Application
category: Musings
---

Make sure you scroll to the end to hear about a bonus new project we're working on, that would have helped reduce the impact of this issue on end users.

## Introduction

Transactional Email APIs require close to 100% uptime, and at MailPace we've been proud to have hit that in the past. However we recently had a brief (just over 2 hours) outage due to a database issue.

Firstly, we'd to apologise for this issue, and in this blog post, we'll take you through the timeline of events during the outage, the root causes that led to it, and the measures taken to not only resolve the issue but also prevent similar occurrences in the future.

## The Outage Timeline

All on Friday August 11th 2023, times in BST.

### 13:00 - Noticing a larger than usual database size

We were doing some routine checks and observed that our database that stores sent emails, API details etc. was about 1.5x larger than it should have been, and was running at about 80% capacity.

### 13:05 - Finding out why

We checked the database and uncovered some data that was older than our typical retention policy of 30 days, upon digging into the logs, a daily clean up cron job was not completing, and exiting with the ominous `killed` message.

The cron job was a Rake (ruby) task that looked something like this:

```ruby
Organization.all.each do |org|
    org.domains.each do |domain|
        domain.outgoing_emails.where("created_at <= ?", org.retention_days.days.ago).destroy_all
    end
end
```

Basically, we go through each domain, and remove any data that's older than the retention policy date.

### 13:15 - Scaling Up the Cron Instance

Returning `killed` usually means running out of memory. So we decided to increase the memory available to the cron job (from 1gb to 8gb), assuming it would run and clean up the old data.

### 13:36 Outage Begins

This assumption was correct, but after running for a few minutes the job ended rather abruptly. From the code above, you may have already identified the issue.

Immediately we started getting notifications that all database transactions were failing, across multiple services. Despite attempts to restart the database, the database was offline and would not come back up, telling us we were out of space.

> This seemed impossible, how could a database which was only at 70% capacity have suddenly ran out of space when we were _deleting_ data

More on this later

### 13:37 - Reaching Out for Support

Our postgres database is actually a managed service, so we immediately contacted support at our upstream provider to identify what was going on

### 13:40 - Keeping Users in the Loop

Simultaneously, we took to Twitter/Mastodon to notify users about the ongoing outage, and assumed our Status page would pick up the error and update automatically (unfortunately this did not happen)

### 13:45 - The Restoration Process

While we waited for a response from our upstream provider we initiated our restoration procedure from a full outage and prepared an offsite backup from six hours prior, on a new database instance. This process takes about an hour end to end, and we have tested it in the past multiple times, so were confident it would work, however it would result in some data loss and continued outage

### 14:30 - Update from upstream provider

As we about to migrate over to our new database, our upstream provider confirmed that they had been automatically notified of the issue at 99% storage filled, and were busy migrating us over to a larger database.

Unfortunately due to a miscommunication on their end they had two support engineers working on the issue simultaneously (one from their automated check and one from our ticket) that slowed this migration down.

### 15:25 - Read only recovery

During the database migration, the database was placed in read-only mode, which meant users could login, but not send emails. We initially thought we were fully back up at this point, but quickly realised our error and updated Twitter.

### 15:50 - Full Recovery

The restoration process was successfully completed, and we were moved onto a larger database instance.

At this point we were fully back up and running and emails were going out again.

## So what actually happened?

Like all system problems, there were multiple causes that came together to trigger this.

Our Cron Job to remove old data was failing silently, and data was piling up, under a normal daily load, this rake task would have succeeded without issue.

However this rake task was quite naive, `destroy_all` will destroy all related records in other tables (which is what we want). Accounts can send thousands of emails/day, with over 10 different tables storing responses, attachments etc. and this meant that each `destroy_all` call could be very large.

When we ran this with a large amount of memory, the ruby code worked, but the database quickly filled up. We assume this was with Write Ahead Logs, but are waiting for our upstream provider to confirm exactly how this happened.

Our Database plan was under specified for growth, and even without this issue we should have had a lot more headroom from day one (we were aware of this issue and were planning to upgrade in the future).

Finally our status page did not pick the issue up, and we were too busy trying to fix the outage to dive into figuring this out. We actually have two status pages, but neither picked up the issue. We're assuming this is because our https://app.mailpace.com address was still returning a 200, despite the database being down.

## Fixes and Preventive Measures

To understand what happened we replicated the issue on a separate database instance from our backup, and could see how much memory was being used, get a handle on what happened, and test some fixes.

### Cleaning up

In production our first step was to clean up the old data. To do this we manually removed data, day-by-day, based on an updated query from our backup testing. During this we were monitoring memory, database size and metrics very closely.

### Fixing the root cause

We then updated our daily clean up job to use `in_batches` (https://apidock.com/rails/ActiveRecord/Batches/BatchEnumerator/destroy_all):

```ruby
domain.outgoing_emails.where("created_at <= ?", org.retention_days.days.ago).in_batches(of: 50).destroy_all
```

This means it will limit queries to only attempt 50 records at a time, reducing the ruby memory requirements and postgres database load.

We also scheduled this to run 4x a day, rather than once, further reducing the impact of a single run.

And we're now on a much larger database instance with a lot more headroom to grow.

### Improved Monitoring and Status Page updates

We added cron monitoring to all our cron jobs and switched our status pages to use a health check endpoint `/health` which explicitly checks for database access, among other things, and returns a 500 error if anything fails.

We're also investigating adding a hot-replica database for automated failover as well.

## What can you do to avoid this in the future?

For all critical services you should have multiple providers set up (not just MailPace). We are working on an outbound SMTP proxy to help solve this in the future. It's called Outgoer, and is free and open source (MIT licensed):

https://github.com/mailpace/outgoer - be warned, it's still in Alpha state and we have yet to publish our first release.

It would have automatically picked up the failures on our end, and routed emails to your backup provider, check it out and let us know what you think.
