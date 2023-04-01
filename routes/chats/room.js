const express = require("express");
const { createRoom } = require("../../controllers/chats/room");

const router = express.Router();

/* CREATE */
router.post("/", createRoom);

/* READ */

/* UPDATE */
// router.put("/:id/users", addRoomUsers);

/* DELETE */

module.exports = router;
