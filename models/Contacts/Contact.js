const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ContactSchema = Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: Array,
      default: [],
    },
    email: {
      type: Array,
      default: [],
    },
    address: {
      type: String,
      required: false,
    },
    desc: {
      type: String,
      required: false,
    },
    active: {
      type: Boolean,
      required: false,
      default: true,
    },
    report: {
      type: String,
    },
  },
  { timestamps: true }
);

const Contact = mongoose.model("Contact", ContactSchema);
module.exports = { Contact };
