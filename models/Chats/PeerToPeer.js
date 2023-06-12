const mongoose = require("mongoose");
const { landinaChatDB } = require("../../config/database");

const PeerChatSchema = new mongoose.Schema({
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
}, {
  timestamps: true
});

const PeerChat = landinaChatDB.model(
  "Peer",
  PeerChatSchema
);
module.exports = PeerChat;
