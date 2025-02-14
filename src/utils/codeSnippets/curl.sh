# Copy and paste into the terminal to send an email using curl

curl "https://app.mailpace.com/api/v1/send" \
  -X POST \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -H "MailPace-Server-Token: API_TOKEN_GOES_HERE" \
  -d '{
"from": "example@domain.com",
"to": "person@somewhere.com",
"subject": "Hello from MailPace.com",
"textbody": "Hello"
}'
