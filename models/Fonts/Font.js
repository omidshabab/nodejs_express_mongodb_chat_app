const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FontSchema = Schema(
  {
    name: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    languages: [
      {
        type: Schema.Types.ObjectId,
        ref: "Language",
      },
    ],
    weights: [
      {
        type: Array,
      },
    ],
    price: {
      type: String,
      required: true,
    },
    path: [
      {
        type: Array,
      },
    ],
  },
  { timestamps: true }
);

const Font = mongoose.model("Font", FontSchema);
module.exports = Font;
