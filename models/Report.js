const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReportSchema = Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Report = mongoose.model("Report", ReportSchema);
module.exports = Report;
