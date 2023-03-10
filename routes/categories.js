const express = require("express");
const { searchCategories } = require("../controllers/categories");

const router = express.Router();

/* CREATE */

/* READ */
router.get("/search/:key", searchCategories);

/* UPDATE */

/* DELETE */

module.exports = router;
