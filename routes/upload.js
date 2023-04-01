const express = require("express");
const { profile } = require("../services/upload/upload.js");
const { verifyToken } = require("../middlewares/accounts/auth.js");
const { upload } = require("../middlewares/upload.js");

const router = express.Router();

router.put("/profile", verifyToken, upload.single("profile"), profile);

module.exports = router;
