const mongoose = require("mongoose");
const { landinaChatDB } = require("../../../config/database");

const MessageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  type: {
    //
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RoomChat",
  },
  forwardBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  content: String,
  mediaUrl: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Message = landinaChatDB.model("Message", MessageSchema);

module.exports = Message;
