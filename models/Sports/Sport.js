const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SportSchema = Schema(
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

const Sport = mongoose.model("Sport", SportSchema);
module.exports = Sport;
