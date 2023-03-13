const express = require("express");
const { verifyToken } = require("../middlewares/auth");
const {
  createContact,
  addContacts,
  getContacts,
  updateContact,
  deleteContact,
} = require("../controllers/contacts");

const router = express.Router();

/* CREATE */
router.post("/:userId", verifyToken, createContact);

/* READ */
router.get("/:userId", verifyToken, getContacts);

/* UPDATE */
router.put("/:userId", verifyToken, updateContact);

/* DELETE */
router.delete("/:userId", verifyToken, deleteContact);

module.exports = router;
