config.action_mailer.delivery_method = :smtp
config.action_mailer.smtp_settings = {
  address: "smtp.mailpace.com",
  port: 587,
  user_name: "YOUR_MAILPACE_SERVER_API_TOKEN",
  password: "YOUR_MAILPACE_SERVER_API_TOKEN",
  authentication: "plain",
  enable_starttls_auto: true
}
