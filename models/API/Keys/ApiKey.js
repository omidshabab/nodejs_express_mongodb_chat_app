const mongoose = require("mongoose");

const ApiKeySchema = new mongoose.Schema({
  key: [
    {
      type: String,
      required: true,
      unique: true,
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("ApiKey", ApiKeySchema);
