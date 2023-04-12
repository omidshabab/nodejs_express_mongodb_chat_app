const mongoose = require("mongoose");

const UpdateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    version: {
      type: String,
      required: true,
    },
    details: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Update = mongoose.model("Update", UpdateSchema);
module.exports = Update;
