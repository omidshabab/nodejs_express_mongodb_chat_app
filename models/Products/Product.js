const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = Schema(
  {
    //
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;
