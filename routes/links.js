const express = require("express");
const { createLink, getLinks, updateLink } = require("../controllers/links.js");
const { verifyToken } = require("../middlewares/accounts/auth.js");

const router = express.Router();

/* CREATE */
router.post("/", verifyToken, createLink);

/* READ */
router.get("/", getLinks);

/* UPDATE */
router.put("/:linkId", verifyToken, updateLink);

/* DELETE */

module.exports = router;
