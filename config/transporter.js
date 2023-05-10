const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.HOST,
  service: process.env.SERVICE,
  port: 465,
  secure: false,
  auth: {
    type: "login",
    user: process.env.USERNAME,
    pass: process.env.PASS,
  },
});

module.exports = transporter;
