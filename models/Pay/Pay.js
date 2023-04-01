const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PaySchema = Schema(
  {
    name: {
      type: String,
      required: true,
    },
    amount: {
      type: String,
      required: true,
    },
    from: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Pay = mongoose.model("Pay", PaySchema);
module.exports = Pay;
