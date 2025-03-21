// Install Nodemailer if you haven't already:

`npm install nodemailer`

// Use the following configuration in your Express app:

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.mailpace.com",
  port: 587,
  secure: false,
  auth: {
    user: "YOUR_MAILPACE_SERVER_API_TOKEN",
    pass: "YOUR_MAILPACE_SERVER_API_TOKEN"
  }
});
