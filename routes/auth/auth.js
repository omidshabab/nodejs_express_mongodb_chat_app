const express = require("express");
const {
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
} = require("../../controllers/auth/auth.js");

const router = express.Router();

/* VERIFY */
router.post("/verify/username", loginUsername);
router.post("/verify/email", loginUsername);
router.post("/verify/phone", loginUsername);
router.post("/verify/token", loginUsername);

/* VALIDATE */
router.post("/validate/username", loginUsername);
router.post("/validate/email", loginUsername);
router.post("/validate/phone", loginUsername);
router.post("/validate/token", loginUsername);

/* SIGNUP */
router.post("/signup/email", signupEmail);
router.post("/signup/phone", signupPhone);
router.post("/signup/phone/verify", signupPhoneVerify);
router.post("/signup/google", signupGoogle);
router.post("/signup/github", signupGithub);

/* LOGIN */
// router.get("/login", loginMethods);
router.post("/login/username", loginUsername);
router.post("/login/email", loginEmail);
router.post("/login/phone", loginPhone);
router.post("/login/phone/verify", loginPhoneVerify);
router.post("/login/google", loginGoogle);
router.post("/login/github", loginGithub);

/* FORGET */
router.post("/forget", loginUsername);

module.exports = router;
