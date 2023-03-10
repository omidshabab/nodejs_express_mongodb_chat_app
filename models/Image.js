const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ImageSchema = Schema(
  {
    name: {
      type: String,
      required: true,
    },
    used: {
      type: String,
      required: true,
    },
    type: {},
    status: {},
    active: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  { timestamps: true }
);

const Image = mongoose.model("Image", ImageSchema);
module.exports = Image;
