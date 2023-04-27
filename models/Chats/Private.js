const mongoose = require("mongoose");
const { landinaChatDB } = require("../../config/database");

const PrivateChatSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const PrivateChat = landinaChatDB.model("Private", PrivateChatSchema);
module.exports = PrivateChat;
