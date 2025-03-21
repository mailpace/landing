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
