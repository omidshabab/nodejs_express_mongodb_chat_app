const Category = require("../models/Category.js");

/* CREATE */

/* READ */
const searchCategories = async (req, res) => {
  try {
    let data = await Category.find({
      $or: [{ name: { $regex: req.params.key } }],
    });
    if (data.length === 0) {
      return res.status(400).json("Not Found!");
    } else {
      return res.status(200).json(data);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* UPDATE */

/* DELETE */

module.exports = { searchCategories };
