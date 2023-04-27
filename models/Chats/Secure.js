const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PrivateChatSchema = Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const PrivateChat = mongoose.model("PrivateChat", PrivateChatSchema);
module.exports = PrivateChat;
