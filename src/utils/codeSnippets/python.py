
headers = {
"Accept": "application/json",
"Content-Type": "application/json",
"MailPace-Server-Token": "API_TOKEN_GOES_HERE"
}

data = {
"from": "example@domain.com",
"to": "person@somewhere.com",
"subject": "Hello from MailPace.com",
"textbody": "Hello"
}

data = json.dumps(data)

response = requests.post('https://app.mailpace.com/api/v1/send', headers=headers, data=data)
