const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ShieldSchema = Schema(
  {
    //
  },
  { timestamps: true }
);

const Shield = mongoose.model("Shield", ShieldSchema);
module.exports = Shield;
