const mongoose = require("mongoose");
const { landinaChatDB } = require("../../config/database");

const RoomSchema = new mongoose.Schema({
  name: String,
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Room = landinaChatDB.model("Room", RoomSchema);
module.exports = Room;
