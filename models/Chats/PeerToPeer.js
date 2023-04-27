const mongoose = require("mongoose");
const { landinaChatDB } = require("../../config/database");

const PeerToPeerChatSchema = new mongoose.Schema(
  {
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
  },
  { timestamps: true }
);

const PeerToPeerChat = landinaChatDB.model(
  "Peer-To-Peer",
  PeerToPeerChatSchema
);
module.exports = PeerToPeerChat;
