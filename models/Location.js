const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LocationSchema = Schema(
  {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: false,
    },
    active: {
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

const Location = mongoose.model("Location", LocationSchema);
module.exports = Location;
