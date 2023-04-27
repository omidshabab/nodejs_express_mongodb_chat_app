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
  content: String,
  mediaUrl: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Message = landinaChatDB.model("Message", MessageSchema);
module.exports = Message;
