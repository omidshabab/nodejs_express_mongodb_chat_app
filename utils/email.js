const nodemailer = require("nodemailer");

const sendEmail = async (from, to, subject, html) => {
  try {
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

    await transporter.sendMail({
      from: from,
      to: to,
      subject: subject,
      html: html,
    });

    return;
  } catch (err) {
    return err;
  }
};

module.exports = sendEmail;
