const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models/User.js");
const {
  generateFromEmail,
  generateUsername,
} = require("unique-username-generator");
const { verifyOTP } = require("../utils/sms.js");
const { default: mongoose } = require("mongoose");

/* SIGNUP */
const signupEmail = async (req, res) => {
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
      _id: new mongoose.Types.ObjectId(),
      username,
      email,
      password: passwordHash,
    });

    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      algorithm: "HS256",
      expiresIn: process.env.JWT_EXPIRY,
    });

    res.status(201).json({
      status: "success",
      data: {
        userId: user._id,
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

const signupPhone = async (req, res) => {
  try {
    const { countryCode, phoneNumber } = req.body;

    if (countryCode == undefined || phoneNumber == undefined)
      return res.status(400).json({
        status: "Error",
        error_code: "required fields",
      });

    if (verifyOTP) {
      const username = generateUsername();

      const user = User({
        username,
        phone: countryCode + phoneNumber,
      });
      await user.save();
      res.status(201).json({
        status: "success",
        data: {
          username: user.username,
          phone: user.phone,
          desc: user.desc,
        },
      });
    } else {
      res.status(500).json({
        status: "failed",
        data: "verify you phone",
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "failed",
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

const signupWallet = async (req, res) => {
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

const loginPhone = async (req, res) => {
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

const loginWallet = async (req, res) => {
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
  signupGoogle,
  signupWallet,
  loginUsername,
  loginEmail,
  loginPhone,
  loginGoogle,
  loginWallet,
};
