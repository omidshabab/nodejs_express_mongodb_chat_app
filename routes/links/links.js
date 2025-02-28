const express = require("express");
const {
  createLink,
  getLinks,
  updateLink,
} = require("../../controllers/links/links.js");
const { verifyToken } = require("../../middlewares/auth.js");

const router = express.Router();

/* CREATE */
router.post("/", verifyToken, createLink);

/* READ */
router.get("/", getLinks);

/* UPDATE */
router.put("/:linkId", verifyToken, updateLink);

/* DELETE */

module.exports = router;
