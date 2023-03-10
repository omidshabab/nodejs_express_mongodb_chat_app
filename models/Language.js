const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LanguageSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const Language = mongoose.model("Language", LanguageSchema);
module.exports = Language;
