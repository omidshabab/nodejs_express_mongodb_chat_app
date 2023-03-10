const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OneWayChatSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  topics: {},
  tag: {
    type: String,
    required: false,
  },
});

const OneWayChat = mongoose.model("OneWayChat", OneWayChatSchema);
module.exports = OneWayChat;
