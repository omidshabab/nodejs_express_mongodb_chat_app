const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PodcastSchema = Schema(
  {
    //
  },
  { timestamps: true }
);

const Podcast = mongoose.model("Podcast", PodcastSchema);
module.exports = Podcast;
