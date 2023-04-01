const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = Schema(
  {
    //
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", PostSchema);
module.exports = Post;
