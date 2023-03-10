const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WalletSchema = Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Wallet = mongoose.model("Wallet", WalletSchema);
module.exports = Wallet;
