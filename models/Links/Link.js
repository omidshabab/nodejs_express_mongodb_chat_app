const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LinkSchema = Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    shorten: {
      type: String,
      required: false,
    },
    desc: {
      type: String,
      required: false,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
    report: {
      type: String,
    },
    language: [
      {
        type: Schema.Types.ObjectId,
        ref: "Language",
      },
    ],
    analytics: [
      {
        type: Schema.Types.ObjectId,
        ref: "Analytic",
      },
    ],
  },
  { timestamps: true }
);

const Link = mongoose.model("Link", LinkSchema);
module.exports = Link;
