// To install the gomysmtp package, run:
// go get github.com/mailpace/gomysmtp

emailClient := gomysmtp.NewClient("mailpace_TOKEN")
emailPayload := gomysmtp.Payload{
	From:     "test@test.com",
	To:       "test@test.com",
	Subject:  "Hello from MailPace",
	Textbody: "Hello",
}

err := emailClient.Send(emailPayload)
if err != nil {
	// handle err
}
