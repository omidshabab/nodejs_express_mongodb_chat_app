const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NewsSchema = Schema(
  {
    name: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    source: {
      type: String,
      required: true,
    },
    hashtags: [
      {
        type: String,
        required: true,
      },
    ],
  },
  { timestamps: true }
);

const News = mongoose.model("News", NewsSchema);
module.exports = News;
