---
title: We used to store files as base64 strings in Postgres, but not anymore
publishDate: 2023-09-09T22:00:03.284Z
excerpt: How we migrated from storing attachments as base64 strings in postgres to an Object Storage system
category: Guides
---

Recently we had an outage caused by our database VM running out of space. One contributing factor was due to **storing email attachments in the database itself as base64 strings.**

## This is not as crazy as it sounds

Email attachments are always encoded into base64 for sending, so our API specifically asks for that as the input format. Yes, there are a [million](https://github.com/google/brotli) [better](https://www.gnu.org/software/gzip/) [formats](https://sourceware.org/bzip2/) for encoding binary data/images, but hey, SMTP is older than the internet, and attachments were [hacked on as MIME types in the mid-90s](https://datatracker.ietf.org/doc/html/rfc2045), so here we are.

P.S. If someone at Google, Microsoft or some other big email giant is reading this and wants to add support to SMTP for e.g. brotli encoded data, please do, and we’ll add support for it.

We originally decided to store attachments as base64 strings in the database, so we wouldn’t have to encode / decode them when sending, and could just use our database as the source for everything. This meant that some rows on the database could have a 30 megabyte string in them, but Postgres can easily handle this, and it simplified our infrastructure greatly.

> Pro tip: to ship a tech product, engineer to get something working, and scale up when you need to. Don’t over engineer, and don’t prematurely optimise.

## Growing pains

We don’t like storing data, it’s expensive, has privacy risks, and doesn't add any value to us or to our users. So we remove all emails 30 days after sending, and our data storage needs are deliberately as low as possible.

Despite this, we’re growing fast, and our database started to grow by several gigabytes per day, so it was time for a change.

## Files files files

The obvious answer is object or file system storage, **instead of putting the attachments in the database we’ll store them as a file somewhere**, and retrieve them when we want them. However this meant:

1. Decoding the attachment when an email arrives and is placed in the send queue
2. Storing the attachment on a separate system
3. Re-encoding the attachment when we send it (and we might have to retry sending it up to 15 times over several days)

This introduces a new dependency on a file store in real time , and it will probably be slow! And remember, we are called Mail**Pace**. So we needed a better solution

## ActiveJob to the rescue

We already had the data in the API request, and in Postgres, and this was plenty fast enough, so instead of changing the way emails are sent, why not move the attachments out of the database _after_ the email is delivered?

We can do this in an async background process, and this means we save the space, but keep the base64 string around for long enough to get the email delivered.

So here's how to move large files out of Postgres and into an object store (like AWS S3 or equivalent) in a Ruby on Rails app, with Active Storage and Active Job.

### Install active storage

First we set up active storage by following [this guide](https://guides.rubyonrails.org/active_storage_overview.html), and create a bucket on S3, or in our case Cellar by [Clever Cloud](https://clever-cloud.com/).

We can add a file to our model by adding this to our model.rb file:

```ruby
has_one_attached :file
```

### Add a job

After we've deployed the migration we can add our Active Job that moves the attachments out of the database and into our object store.

```ruby
class SaveAttachmentsToCellarJob < ApplicationJob
  queue_as :default

  def perform(email_id)
    email = OutgoingEmail.find(email_id)

    email.attachments.each do |attachment|
      next if attachment.content == nil # Skip if already moved

      decoded_content = Base64.decode64(attachment.content)
      # We use at tempfile here to avoid using memory for large attachments
      file = Tempfile.new
      file.binmode
      file.write(decoded_content)
      file.rewind
      attachment.file.attach(io: file, filename: attachment.name,
                             content_type: attachment.content_type, identify: false) # This is what stores the file in the object store, we set identify to false as the users provide teh Content-Type themselves

      attachment.update(content: nil) # Remove the base64 string from the database
    end
  end
end
```

And then we add it to our model to run when things change, using `perform_later` so it runs in the background.

```ruby
after_commit :move_attachments_to_cellar, on: :update

...

def move_attachments_to_cellar
  return unless status == "delivered" && attachments.any?

  SaveAttachmentsToCellarJob.perform_later(id)
end
```

### Change the UI

In the view.erb file, we can create a link to the file URL:

```ruby
<%= link_to "#{attachment.name} (#{attachment.content_type})", url_for(attachment.file) %>
```

### Purge on delete

To ensure we delete files in our object store when we delete the email from our database, inside the model with the file we add:

```ruby
after_destroy :purge_attachment

...

def purge_attachment
  file.purge_later
end
```

This will remove the file when the model is deleted.

Finally, we write some unit tests, add the right credentials for the bucket, add we're good to go!

## What happened

Immediately after deployment we started seeing attachments shifting over to our bucket. Within an hour we had saved 500mb of database storage, and our database stopped growing in size almost immediately.

All this with no impact on our sending speed, and minimal changes to our current infrastructure.

Nice!
