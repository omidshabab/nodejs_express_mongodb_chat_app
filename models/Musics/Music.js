const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MusicSchema = Schema(
  {
    name: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Music = mongoose.model("Music", MusicSchema);
module.exports = Music;
