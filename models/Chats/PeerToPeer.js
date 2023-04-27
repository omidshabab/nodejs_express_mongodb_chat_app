const mongoose = require("mongoose");
const { landinaChatDB } = require("../../config/database");

const PeerToPeerChatSchema = new mongoose.Schema({
  between: [
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

const PeerToPeerChat = landinaChatDB.model(
  "Peer-To-Peer",
  PeerToPeerChatSchema
);
module.exports = PeerToPeerChat;
