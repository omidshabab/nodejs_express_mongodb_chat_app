const mongoose = require("mongoose");
const { landinaChatDB } = require("../../config/database");

const BotChatSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const BotChat = landinaChatDB.model("Bot", BotChatSchema);
module.exports = BotChat;
