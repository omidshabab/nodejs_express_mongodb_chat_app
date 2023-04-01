const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StyleSchema = Schema(
  {
    //
  },
  { timestamps: true }
);

const Style = mongoose.model("Style", StyleSchema);
module.exports = Style;
