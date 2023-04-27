const mongoose = require("mongoose");
const { landinaChatDB } = require("../../../config/database");
const MESSAGE_TYPES = require("../../../config/message");

const MessageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    type: {
      type: String,
      enum: MESSAGE_TYPES,
      default: MESSAGE_TYPES.TEXT,
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
  },
  { timestamps: true }
);

const Message = landinaChatDB.model("Message", MessageSchema);
module.exports = Message;
