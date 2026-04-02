require('dotenv').config();
const nodemailer = require('nodemailer');

module.exports.sendMail = async (email, subject, html) => {
    let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  let info = await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: subject,
    html: html,
  });

  console.log("Message sent:", info.response);
}
