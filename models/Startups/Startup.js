const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StartupSchema = Schema(
  {
    //
  },
  { timestamps: true }
);

const Startup = mongoose.model("Startup", StartupSchema);
module.exports = Startup;
