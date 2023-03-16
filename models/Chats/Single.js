const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SingleChatSchema = Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const SingleChat = mongoose.model("SingleChat", SingleChatSchema);
module.exports = SingleChat;
