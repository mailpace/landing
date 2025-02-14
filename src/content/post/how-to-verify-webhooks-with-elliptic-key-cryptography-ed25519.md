---
title: Webhook verification with Ed25519
publishDate: 2022-01-16T20:30:03.284Z
excerpt: How to use Elliptic Key Cryptography (Ed25519) to verify the contents of webhooks
category: Changelog
---

# Background

We launched support for [webhooks](https://docs.mailpace.com/guide/webhooks/) back in November, a long awaited feature that allows users of our service to receive an HTTPS notification whenever an email is delivered, bounces, queued, is marked as spam etc.

One of our customers pointed out that we don't support verification of our webhooks. That is, outside of the originating IP address and HTTPS certificate (our webhooks can only be sent over HTTPS), there is no definitive proof that a webhook originated from our servers and was not modified in any way.

This could be a problem if someone was able to spoof a request or modify an inflight request with malicious data.

> P.S. Having developers as customers is amazing. The customer that flagged this literally sent through examples of how we could implement it, including pros and cons of different methodologies, comparisons with other vendors, links to libraries etc. And they provided invaluable feedback on the implementation

# Wait, haven't we done this before?

Like most things in tech, we've faced this problem before. If you've read our blog in the past you might have come across [our post about DKIM keys](https://blog.mailpace.com/blog/whats-a-DKIM-record/). In DKIM we want to make sure an email has originated from a specific server, and confirm it hasn't been modified in-flight (sound familiar?)

The solution there is [Public Key Cryptography](https://en.wikipedia.org/wiki/Public-key_cryptography), signing the request with a private key on our mail server, and using DNS to share the public key with other email providers. In this case, we can use Public Key Cryptography again, and share the public key with our customers through our web interface.

# Enter Ed25519 and Elliptic Key Cryptography

The memorably named [Ed25519](https://datatracker.ietf.org/doc/html/rfc8032) is a digital signature algorithm that uses Elliptic Key Cryptography to compute a 64-bit signature of any piece of data. It's fast, secure and safe - but most importantly the **key lengths are and signatures are very short (32 bits and 64 bits respectively)**. This is important because every webhook will be sent with a signature included, so we don't want to inflate the request size too much.

> We did try out Ed25519 in the early days of MailPace for DKIM signatures, but found that support across many email providers was lacking

Luckily there are libraries for almost every language that implement Ed25519 for you, so you don't need to read or understand the underlying algorithm. Although the maths is complex, the RFC is written for developers using well-defined terms and includes code examples. So even if you're like me and your maths education was permanently scarred by abstract and opaque mathematical terminology, you can still read the RFC and get a good grasp of it with relative ease.

# How we do it

When a new domain is registered with MailPace, we generate and store a private key (also known as the signing key), ready for signing webhooks. We make the public key part of that private key (also called the verify key) available in our application UI as a string that can be copied. Then when a webhook is to be sent:

- Our worker prepares the JSON for the request
- We create a signature of the webhook request body using the private key
- We Base64 encode the signature
- We add the signature to the webhook headers
- We send the request over HTTPS

On the user's end, they retrieve the header from the request containing the signature, decode it from Base64 and verify it using the public / verify key.

There are a couple of specific things here that we do:

1. **Sending the signature as an HTTP Header.** This ensures that users don't have to mess with the request body ([like we had to do for Paddle](https://blog.mailpace.com/blog/verify-paddle-webhooks-in-ruby/)) to get back to the original signed message
2. **Encoding the signature and keys as Base64.** HTTP is a text based protocol (basically ASCII), and sending binary data over HTTP will not work. Our signature and keys are in binary format, so we use Base64 to encode them into a sensible text-based format, and by using "strict" encoding for Base64 we avoid line breaks and carriage returns to ensure our signatures are completely safe

# Show me the code!

Here are some snippets to illustrate how we do this in Ruby:

**Creating the signing key**

```ruby
def create_webhook_key
 key = Ed25519::SigningKey.generate.to_bytes
 self.webhook_signing_key = Base64.strict_encode64(key)
end
```

**Signing the body**

```ruby
def sign_body(body, key)
 signature_key_bytes = Base64.strict_decode64(key)
 signing_key = Ed25519::SigningKey.new(signature_key_bytes)
 signature = signing_key.sign(body)
 Base64.strict_encode64(signature)
end
```

**Attaching it to the request Headers**

```ruby
headers: {
  "User-Agent" => "mailpace_webhooks/1.0",
  "Content-Type" => "application/json",
  "X-MailPace-Signature" => sign_body(body, key)
}
```

Aside from some glue code to pull this together, that's pretty much all we do on our end.

## How to verify our webhooks

```ruby
require "ed25519"

# Assuming you have the headers available in a headers array
signature_base64 = headers["X-MailPace-Signature"]
signature = Base64.strict_decode64(signature_base_64)

verify_key_base64 = "Your Public Key from app.mailpace.com here"
verify_key = Ed25519::VerifyKey.new(Base64.strict_decode64(verify_key_base64))

# Assuming the full body of the request is available under a request object
message = request.raw_post

verify_key.verify(signature, message) # True if verification passed!
```

Pretty simple really! If you'd like to learn more, check out the docs at https://docs.mailpace.com/guide/webhooks/
