// Install with npm install @mailpace/mailpace.js

const client = new MailPace.DomainClient('API_TOKEN_HERE');

client
  .sendEmail({
    from: 'test@test.com',
    to: 'test@test.com',
    subject: 'test',
    htmlbody: '<H1>HTML Email</h1>',
  })
  .then((r) => {
    console.log(r);
  });
