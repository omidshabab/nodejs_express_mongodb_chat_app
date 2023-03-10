const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AdsSchema = Schema(
  {
    //
  },
  { timestamps: true }
);

const Ads = mongoose.model("Ads", AdsSchema);
module.exports = Ads;
