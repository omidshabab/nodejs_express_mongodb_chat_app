const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategorySchema = Schema({
  name: {
    type: String,
    required: true,
  },
});

const Category = mongoose.model("Category", CategorySchema);
module.exports = Category;
