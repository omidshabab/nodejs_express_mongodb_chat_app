const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PhoneSchema = Schema(
  {
    //
  },
  { timestamps: true }
);

const Phone = mongoose.model("Phone", PhoneSchema);
module.exports = Phone;
