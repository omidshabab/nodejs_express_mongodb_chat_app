const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MailSchema = Schema(
  {
    title: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Mail = mongoose.model("Mail", MailSchema);
module.exports = Mail;
