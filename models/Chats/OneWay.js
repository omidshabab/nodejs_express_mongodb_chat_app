const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OneWayChatSchema = Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const OneWayChat = mongoose.model("OneWayChat", OneWayChatSchema);
module.exports = OneWayChat;
