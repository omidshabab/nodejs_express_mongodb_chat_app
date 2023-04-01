const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ArticleSchema = Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    desc: {
      type: String,
      required: [true, "Description is required"],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    likes: {
      type: Number,
      default: 0,
      data: [
        {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },
    dislikes: {
      type: Number,
      default: 0,
      data: [
        {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },
    images: {
      type: String,
    },
  },
  { timestamps: true }
);

const Article = mongoose.model("Article", ArticleSchema);
module.exports = Article;
