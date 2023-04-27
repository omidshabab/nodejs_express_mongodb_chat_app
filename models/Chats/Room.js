const mongoose = require("mongoose");
const { landinaChatDB } = require("../../config/database");

const RoomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
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
  },
  { timestamps: true }
);

const Room = landinaChatDB.model("Room", RoomSchema);
module.exports = Room;
