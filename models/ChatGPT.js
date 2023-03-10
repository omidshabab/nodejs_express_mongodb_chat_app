const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ChatGPTSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  topics: {
    //
  },
  tags: {
    type: Number,
    required: false,
    data: {
      //
    },
  },
});

const ChatGPT = mongoose.model("ChatGPT", ChatGPTSchema);
module.exports = ChatGPT;
