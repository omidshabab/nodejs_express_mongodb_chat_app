const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const HashtagSchema = Schema(
  {
    name: {
      type: String,
      required: true,
    },
    used: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Hashtag = mongoose.model("Hashtag", HashtagSchema);
module.exports = Hashtag;
