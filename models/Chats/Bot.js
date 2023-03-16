const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BotChatSchema = Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const BotChat = mongoose.model("BotChat", BotChatSchema);
module.exports = BotChat;
