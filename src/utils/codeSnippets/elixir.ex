# Add to your `mix.exs` dependencies
{:mailpace_client, "~> 0.1.0"}

# Add to Application Config
config :mailpace_client, token: "TOKEN_GOES_HERE"

# Send an email using MailPace
mailpaceClient.send_email(%mailpaceClient.EmailSendRequest{
  from: "test@test.com",
  subject: "Hello from MailPace",
  textbody: "Hello",
  to: "test@test.com"
})
