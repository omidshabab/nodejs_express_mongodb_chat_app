const jwt = require("jsonwebtoken");
const HTTP_STATUS = require("../config/status");

const verifyAPIKey = async (req, res, next) => {
  try {
    //
    next();
  } catch (err) {
    res.status(500).json({
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      data: err.message,
    });
  }
};

const verifyToken = async (req, res, next) => {
  try {
    let token = req.header("Authorization");

    if (!token) {
      return res.status(403).send("Access Denied");
    }

    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft();
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(500).json({
      status: "failed",
      data: err.message,
    });
  }
};

const verifyUsername = async (req, res, next) => {
  try {
    res.status(200).json("success");
    next();
  } catch (err) {
    res.status(500).json({
      status: "failed",
      data: err.message,
    });
  }
};

const verifyEmail = async (req, res, next) => {
  try {
    res.status(200).json("success");
    next();
  } catch (err) {
    res.status(500).json({
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      data: err.message,
    });
  }
};

module.exports = {
  verifyAPIKey,
  verifyToken,
  verifyUsername,
  verifyEmail,
};
