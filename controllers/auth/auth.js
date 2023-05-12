const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../../models/Users/User.js");
const {
  generateFromEmail,
  generateUsername,
} = require("unique-username-generator");
const { default: mongoose } = require("mongoose");
const HTTP_STATUS = require("../../config/status.js");
const transporter = require("../../config/transporter.js");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifySid = process.env.TWILIO_SERVICE_SID;
const client = require("twilio")(accountSid, authToken);

/* SIGNUP */
const signupEmail = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email == undefined || password == undefined)
      return res
        .status(400)
        .json({ msg: "Please send all requirement fields!" });

    let user = await User.findOne({ email: email });
    if (user) return res.status(400).json({ msg: "User already exist." });

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const username = generateFromEmail(email, 3);

    const newUser = User({
      _id: new mongoose.Types.ObjectId(),
      username,
      email,
      password: passwordHash,
    });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      algorithm: "HS256",
      expiresIn: process.env.JWT_EXPIRY,
    });

    res.status(201).json({
      status: HTTP_STATUS.OK,
      data: {
        userId: newUser._id,
        username: username,
        email: newUser.email,
        desc: newUser.desc,
        type: newUser.type,
        token,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      data: err.message,
    });
  }
};

const signupPhone = async (req, res) => {
  try {
    const { phone } = req.body;
    let user = await User.findOne({ phone: phone });
    if (phone == undefined)
      return res.status(400).json({ msg: "Please send your phone number!" });

    if (user) return res.status(400).json({ msg: "User already exist." });

    // Send verification code via Twilio
    client.verify.v2
      .services(verifySid)
      .verifications.create({ to: phone, channel: "sms" });

    res.status(200).json({
      status: HTTP_STATUS.OK,
    });
  } catch (err) {
    res.status(500).json({
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      data: err.message,
    });
  }
};

const signupPhoneVerify = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    let user = await User.findOne({ phone: phone });
    if (phone == undefined)
      return res.status(400).json({ msg: "Please send your phone number!" });

    if (user) return res.status(400).json({ msg: "User already exist." });

    const username = generateUsername("newUser", 5, 8);

    const newUser = User({
      phone,
      username,
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      algorithm: "HS256",
      expiresIn: process.env.JWT_EXPIRY,
    });

    // Get verification code via Twilio
    client.verify.v2
      .services(verifySid)
      .verificationChecks.create({ to: phone, code: otp });

    res.status(201).json({
      status: HTTP_STATUS.OK,
      data: {
        userId: newUser._id,
        name: newUser.name,
        username,
        desc: newUser.desc,
        type: newUser.type,
        token,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      data: err.message,
    });
  }
};

const signupGoogle = async (req, res) => {
  try {
    const { email, password } = req.body;

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    if (email == undefined || password == undefined)
      return res.status(400).json({
        status: "Error",
        error_code: "required fields",
      });

    username = generateFromEmail(email, 3);

    const user = User({
      username,
      email,
      password: passwordHash,
    });
    await user.save();
    res.status(201).json({
      status: "success",
      data: {
        username: user.username,
        email: user.email,
        desc: user.desc,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "failed",
      data: err.message,
    });
  }
};

const signupGithub = async (req, res) => {
  try {
    const { email, password } = req.body;

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    if (email == undefined || password == undefined)
      return res.status(400).json({
        status: "Error",
        error_code: "required fields",
      });

    username = generateFromEmail(email, 3);

    const user = User({
      username,
      email,
      password: passwordHash,
    });
    await user.save();
    res.status(201).json({
      status: "success",
      data: {
        username: user.username,
        email: user.email,
        desc: user.desc,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "failed",
      data: err.message,
    });
  }
};

/* LOGIN  */
const loginUsername = async (req, res) => {
  try {
    const { username, password } = req.body;
    let user = await User.findOne({ username: username });
    if (username == undefined || password == undefined)
      return res
        .status(400)
        .json({ msg: "Please send all the required values!" });
    if (!user) return res.status(400).json({ msg: "User does not exist." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials." });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      algorithm: "HS256",
      expiresIn: process.env.JWT_EXPIRY,
    });
    delete user.password;

    res.status(200).json({
      status: "success",
      data: {
        userId: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        desc: user.desc,
        type: user.type,
        token,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "failed",
      data: err.message,
    });
  }
};

const loginEmail = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email: email });
    if (email == undefined || password == undefined)
      return res
        .status(400)
        .json({ msg: "Please send all the required values!" });
    if (!user) return res.status(400).json({ msg: "User does not exist." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials." });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      algorithm: "HS256",
      expiresIn: process.env.JWT_EXPIRY,
    });

    // SEND EMAIL
    await transporter.sendMail({
      from: '"Landina LLC" <hey@landina.co>',
      to: user.email,
      subject: "New Login to your Landina Account",
      html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
      <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
      <html lang="en">

        <head></head>
        <div id="__react-email-preview" style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0">Join bukinoshita on Vercel<div> ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿</div>
        </div>

        <body style="margin-left:auto;margin-right:auto;margin-top:auto;margin-bottom:auto;background-color:rgb(255,255,255);font-family:ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, &quot;Noto Sans&quot;, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;, &quot;Noto Color Emoji&quot;">
          <table align="center" role="presentation" cellSpacing="0" cellPadding="0" border="0" width="100%" style="max-width:37.5em;margin-left:auto;margin-right:auto;margin-top:40px;margin-bottom:40px;width:465px;border-radius:0.25rem;border-width:1px;border-style:solid;border-color:rgb(234,234,234);padding:20px">
            <tr style="width:100%">
              <td>
                <table align="center" border="0" cellPadding="0" cellSpacing="0" role="presentation" width="100%" style="margin-top:32px">
                  <tbody>
                    <tr>
                      <td><img alt="Vercel" src="https://react-email-demo-ijnnx5hul-resend.vercel.app/static/vercel-logo.png" width="40" height="37" style="display:block;outline:none;border:none;text-decoration:none;margin-left:auto;margin-right:auto;margin-top:0px;margin-bottom:0px" /></td>
                    </tr>
                  </tbody>
                </table>
                <h1 style="margin-left:0px;margin-right:0px;margin-top:30px;margin-bottom:30px;padding:0px;text-align:center;font-size:24px;font-weight:400;color:rgb(0,0,0)">Join <strong>My Project</strong> on <strong>Vercel</strong></h1>
                <p style="font-size:14px;line-height:24px;margin:16px 0;color:rgb(0,0,0)">Hello zenorocha,</p>
                <p style="font-size:14px;line-height:24px;margin:16px 0;color:rgb(0,0,0)"><strong>bukinoshita</strong> (<a target="_blank" style="color:rgb(37,99,235);text-decoration:none;text-decoration-line:none" href="mailto:bukinoshita@example.com">bukinoshita@example.com</a>) has invited you to the <strong>My Project</strong> team on <strong>Vercel</strong>.</p>
                <table align="center" border="0" cellPadding="0" cellSpacing="0" role="presentation" width="100%">
                  <tbody>
                    <tr>
                      <td>
                        <table width="100%" align="center" role="presentation" cellSpacing="0" cellPadding="0" border="0">
                          <tbody style="width:100%">
                            <tr style="width:100%">
                              <td align="right"><img src="https://react-email-demo-ijnnx5hul-resend.vercel.app/static/vercel-user.png" width="64" height="64" style="display:block;outline:none;border:none;text-decoration:none;border-radius:9999px" /></td>
                              <td align="center"><img alt="invited you to" src="https://react-email-demo-ijnnx5hul-resend.vercel.app/static/vercel-arrow.png" width="12" height="9" style="display:block;outline:none;border:none;text-decoration:none" /></td>
                              <td align="left"><img src="https://react-email-demo-ijnnx5hul-resend.vercel.app/static/vercel-team.png" width="64" height="64" style="display:block;outline:none;border:none;text-decoration:none;border-radius:9999px" /></td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <table align="center" border="0" cellPadding="0" cellSpacing="0" role="presentation" width="100%" style="margin-bottom:32px;margin-top:32px;text-align:center">
                  <tbody>
                    <tr>
                      <td><a href="https://vercel.com/teams/invite/foo" target="_blank" style="p-x:20px;p-y:12px;line-height:100%;text-decoration:none;display:inline-block;max-width:100%;padding:12px 20px;border-radius:0.25rem;background-color:rgb(0,0,0);text-align:center;font-size:12px;font-weight:600;color:rgb(255,255,255);text-decoration-line:none"><span></span><span style="p-x:20px;p-y:12px;max-width:100%;display:inline-block;line-height:120%;text-decoration:none;text-transform:none;mso-padding-alt:0px;mso-text-raise:9px">Join the team</span><span></span></a></td>
                    </tr>
                  </tbody>
                </table>
                <p style="font-size:14px;line-height:24px;margin:16px 0;color:rgb(0,0,0)">or copy and paste this URL into your browser: <a target="_blank" style="color:rgb(37,99,235);text-decoration:none;text-decoration-line:none" href="https://vercel.com/teams/invite/foo">https://vercel.com/teams/invite/foo</a></p>
                <hr style="width:100%;border:none;border-top:1px solid #eaeaea;margin-left:0px;margin-right:0px;margin-top:26px;margin-bottom:26px;border-width:1px;border-style:solid;border-color:rgb(234,234,234)" />
                <p style="font-size:12px;line-height:24px;margin:16px 0;color:rgb(102,102,102)">This invitation was intended for <span style="color:rgb(0,0,0)">zenorocha </span>.This invite was sent from <span style="color:rgb(0,0,0)">204.13.186.218</span> located in <span style="color:rgb(0,0,0)">São Paulo, Brazil</span>. If you were not expecting this invitation, you can ignore this email. If you are concerned about your account&#x27;s safety, please reply to this email to get in touch with us.</p>
              </td>
            </tr>
          </table>
        </body>

      </html>`, // HTML body,
    });

    res.status(200).json({
      status: HTTP_STATUS.OK,
      data: {
        userId: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        desc: user.desc,
        type: user.type,
        token,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      data: err.message,
    });
  }
};

const loginPhone = async (req, res) => {
  try {
    const { phone } = req.body;
    let user = await User.findOne({ phone: phone });
    if (phone == undefined)
      return res.status(400).json({ msg: "Please send your phone number!" });

    if (!user) return res.status(400).json({ msg: "User does not exist." });

    // Send verification code via Twilio
    client.verify.v2
      .services(verifySid)
      .verifications.create({ to: phone, channel: "sms" });

    res.status(200).json({
      status: HTTP_STATUS.OK,
    });
  } catch (err) {
    res.status(500).json({
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      data: err.message,
    });
  }
};

const loginPhoneVerify = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    let user = await User.findOne({ phone: phone });
    if (phone == undefined)
      return res.status(400).json({ msg: "Please send your phone number!" });

    if (!user) return res.status(400).json({ msg: "User does not exist." });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      algorithm: "HS256",
      expiresIn: process.env.JWT_EXPIRY,
    });

    // Get verification code via Twilio
    client.verify.v2
      .services(verifySid)
      .verificationChecks.create({ to: phone, code: otp });

    res.status(200).json({
      status: HTTP_STATUS.OK,
      data: {
        userId: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        desc: user.desc,
        type: user.type,
        token,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      data: err.message,
    });
  }
};

const loginGoogle = async (req, res) => {
  try {
    const { username, password } = req.body;
    let user = await User.findOne({ username: username });
    if (username == undefined || password == undefined)
      return res
        .status(400)
        .json({ msg: "Please send all the required values!" });
    if (!user) return res.status(400).json({ msg: "User does not exist." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials." });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    delete user.password;

    res.status(200).json({
      status: "success",
      data: {
        token,
        username: user.username,
        name: user.name,
        desc: user.desc,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "failed",
      data: err.message,
    });
  }
};

const loginGithub = async (req, res) => {
  try {
    const { username, password } = req.body;
    let user = await User.findOne({ username: username });
    if (username == undefined || password == undefined)
      return res
        .status(400)
        .json({ msg: "Please send all the required values!" });
    if (!user) return res.status(400).json({ msg: "User does not exist." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials." });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    delete user.password;

    res.status(200).json({
      status: "success",
      data: {
        token,
        username: user.username,
        name: user.name,
        desc: user.desc,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "failed",
      data: err.message,
    });
  }
};

module.exports = {
  signupEmail,
  signupPhone,
  signupPhoneVerify,
  signupGoogle,
  signupGithub,
  loginUsername,
  loginEmail,
  loginPhone,
  loginPhoneVerify,
  loginGoogle,
  loginGithub,
};
