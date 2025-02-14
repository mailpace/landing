# Install and configure
$ gem install mailpace-rails
$ rails secret
$ rails credentials:edit

# Add to your credentials
mailpace_api_token: "TOKEN_GOES_HERE"

# In your app
config.action_mailer.delivery_method = :mailpace
config.action_mailer.mailpace_settings = { api_token: Rails.application.credentials.mailpace_api_token }
