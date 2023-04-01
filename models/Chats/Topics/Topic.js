const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TopicChatSchema = Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const TopicChat = mongoose.model("TopicChat", TopicChatSchema);
module.exports = TopicChat;
