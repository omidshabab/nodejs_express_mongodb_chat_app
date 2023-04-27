const mongoose = require("mongoose");
const { landinaChatDB } = require("../../config/database");

const OneWayChatSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const OneWayChat = landinaChatDB.model("OneWayChat", OneWayChatSchema);
module.exports = OneWayChat;
