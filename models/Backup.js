const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BackupSchema = Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Backup = mongoose.model("Backup", BackupSchema);
module.exports = Backup;
