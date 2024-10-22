const express = require("express");
const { verifyToken } = require("../../../middlewares/auth.js");
const {
  createComment,
} = require("../../../controllers/coupons/comments/comments.js");

const router = express.Router();

/* CREATE */
router.post("/", verifyToken, createComment);

/* READ */

/* UPDATE */

/* DELETE */

module.exports = router;
