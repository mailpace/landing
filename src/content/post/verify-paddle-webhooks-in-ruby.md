---
title: How to Verify Paddle.com Webhooks / Alerts in Ruby on Rails
publishDate: 2021-10-05T08:00:03.284Z
excerpt: A short guide to verifying payment provider Paddle.com webhooks and alerts in Ruby on Rails
category: Guides
---

When we first launched [MailPace](https://mailpace.com) we chose [Paddle](https://paddle.com) as our Payments Provider, primarily because they handle all sales taxes and payment infrastructure globally. One of the things that took longer than it should have was ensuring that alerts (webhooks) received from paddle.com actually come from Paddle.

Luckily Paddle signs every request using [Public Key Cryptography](https://en.wikipedia.org/wiki/Public-key_cryptography), and it works in a similar way to [DKIM](https://blog.mailpace.com/blog/whats-a-DKIM-record/). Paddle creates a short signature, using a Private Key specific to our Paddle account, and includes it with every webhook sent from their system, which we can verify on our end using the Public Key (see https://developer.paddle.com/webhook-reference/verifying-webhooks for more details). **Without this a nefarious actor might figure out your webhook endpoint and create a bunch of fake subscriptions/updates in your app.**

This verification is great, and Paddle has ok docs on how to do it. But I couldn't get the [paddle code examples](https://developer.paddle.com/webhook-reference/verifying-webhooks) working in the MailPace Rails app without some frustrating trial and error, so here's an example of how you can implement Paddle webhook endpoints with verification in Ruby on Rails. Broadly this should apply to any language as well.

# Dependencies

You'll need to ensure you have the following dependencies available in your `Gemfile` (OpenSSL and Base64 should already be in Rails):

- `php-serialize`
- `openssl`
- `base64`

# Code!

#### **`app/controllers/api/paddle_controller.rb`**

```ruby
# A standard Rails API endpoint definition
class Api::PaddleController < ActionController::API
  # Ensure every request is validated, except when testing
  before_action :verify_webhook, unless: -> { ENV["RAILS_ENV"] == "test" }

  # Select the right method depending on the webhook sent by paddle, see full list here https://developer.paddle.com/webhook-reference/
  def paddle
    case params["alert_name"]
    when "subscription_created"
      subscription_created
    when "subscription_payment_succeeded"
      subscription_payment_success
    else
      render(
        json: { error: "alert_name #{params['alert_name']} does not match a known webhook / alert" },
        status: :not_found
      )
    end
  end

  def subscription_created
    # Application logic here (e.g. update user account)
  end

  def subscription_payment_success
    # Application logic here (e.g. update user account)
  end

  private

  # The actual verification takes place below
  def verify_webhook
    # Copy and paste from https://vendors.paddle.com/public-key
    # You should store this in an environment variable in a real app, and note the line breaks / formatting which must match exactly
    public_key = "-----BEGIN PUBLIC KEY-----
-----END PUBLIC KEY-----"

    # We take all the params available as JSON structure
    data = accept_all_params.as_json

    # Extract the signature itself to verify later
    signature = Base64.decode64(data["p_signature"])

    # Remove the unsigned params (the signature itself and additional params from Rails)
    data.delete("p_signature")
    data.delete("controller")
    data.delete("action")

    # Sort & serialize params to match the original way Paddle signs the request
    data.each { |key, value| data[key] = String(value) }
    params_sorted = data.sort_by { |key, _value| key }
    params_serialized = PHP.serialize(params_sorted, true)

    # Verify the params and respond with 403 if verification fails
    digest = OpenSSL::Digest.new("SHA1")
    pub_key = OpenSSL::PKey::RSA.new(public_key).public_key

    return head(403) unless pub_key.verify(digest, signature, params_serialized)
  end

  def accept_all_params
    # We do this because paddle has a p_signature, and if they add extra params in the future
    # we need to ensure the signature still validates

    params.permit!
  end
end

```

That's it - easy when you know how.
