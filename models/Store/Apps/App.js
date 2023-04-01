const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AppSchema = Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      trim: true,
    },
    name: {
      type: String,
      trim: true,
    },
    desc: {
      type: String,
    },
    features: [
      {
        type: String,
        version: String,
      },
    ],
    versions: [
      {
        type: Schema.Types.ObjectId,
        ref: "Update",
      },
    ],
  },
  { timestamps: true }
);

const App = mongoose.model("App", AppSchema);
module.exports = App;
