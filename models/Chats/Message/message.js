const mongoose = require("mongoose");
const { landinaChatDB } = require("../../../config/database");
const MESSAGE_TYPES = require("../../../config/message");

const MessageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  toId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
  },
  forwardBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  type: {
    type: String,
    enum: MESSAGE_TYPES,
    default: MESSAGE_TYPES.TEXT,
  },
  topic: {
    type: String,
    default: "general",
  },
  content: String,
  mediaUrl: String,
  date: {
    type: Date,
    default: Date.now,
  },
});

const Message = landinaChatDB.model("Message", MessageSchema);
module.exports = Message;
