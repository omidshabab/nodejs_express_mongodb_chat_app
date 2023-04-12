const express = require("express");
const {
  createNotif,
  getNotif,
  getNotifs,
  updateNotif,
  deleteNotif,
} = require("../controllers/notifications/notifications");
const { verifyToken } = require("../middlewares/accounts/auth");

const router = express.Router();

/* CREATE */
router.post("/", verifyToken, createNotif);

/* READ */
router.get("/:notifId", verifyToken, getNotif);
router.get("/", verifyToken, getNotifs);

/* UPDATE */
router.put("/:notifId", verifyToken, updateNotif);

/* DELETE */
router.put("/:notifId", verifyToken, deleteNotif);

module.exports = router;
