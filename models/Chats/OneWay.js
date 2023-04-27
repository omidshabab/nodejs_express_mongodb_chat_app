const mongoose = require("mongoose");
const { landinaChatDB } = require("../../config/database");

const OneWayChatSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const OneWayChat = landinaChatDB.model("OneWay", OneWayChatSchema);
module.exports = OneWayChat;
