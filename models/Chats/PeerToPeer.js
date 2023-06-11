const mongoose = require("mongoose");
const { landinaChatDB } = require("../../config/database");

const PeerChatSchema = new mongoose.Schema({
  between: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
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

const PeerChat = landinaChatDB.model(
  "Peer",
  PeerChatSchema
);
module.exports = PeerChat;
