const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      service: process.env.SERVICE,
      port: 465,
      secure: false,
      auth: {
        type: "login",
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject: subject,
      text: text,
    });

    res.status(200).json({
      status: "success",
      data: "Email sent. please verify.",
    });
  } catch (err) {
    console.log(err.message);

    res.status(500).json({
      status: "failed",
      data: err.message,
    });
  }
};

module.exports = sendEmail;
