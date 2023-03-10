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
router.post("/create", verifyToken, createContact);
router.post("/add", verifyToken, addContacts);

/* READ */
router.get("/get", verifyToken, getContacts);

/* UPDATE */
router.put("/update", verifyToken, updateContact);

/* DELETE */
router.delete("/delete", verifyToken, deleteContact);

module.exports = router;
