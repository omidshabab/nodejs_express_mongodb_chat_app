const jwt = require("jsonwebtoken");

const verifyAPIKey = async (req, res, next) => {
  try {
    //
    next();
  } catch (err) {
    res.status(500).json({
      status: STATUS.Failed,
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
      status: STATUS.Failed,
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
      status: STATUS.Failed,
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
      status: STATUS.Failed,
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
