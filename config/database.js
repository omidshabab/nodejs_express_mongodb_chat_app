const mongoose = require("mongoose");

/* MODELS */
const Category = require("../models/Category.js");
const Language = require("../models/Language.js");

/* DATA */
const categories = require("../data/categories.js");
const languages = require("../data/languages.js");

async function connection() {
  try {
    const db = mongoose.connection;
    db.on("error", (error) => console.log(error));
    db.once("open", async () => {
      // CATEGORIES
      if ((await Category.countDocuments().exec()) > 0) return;
      let submitCategories = [];
      categories.forEach((category) => {
        submitCategories.push({ name: category });
      });
      Category.insertMany(submitCategories, (err) => {
        if (err) return console.log(err);
        console.log("Categories submitted");
      });

      // LANGUAGES
      if ((await Language.countDocuments().exec()) > 0) return;
      let submitLangs = [];
      languages.forEach((language) => {
        submitLangs.push({ name: language });
      });
      Language.insertMany(submitLangs, (err) => {
        if (err) return console.log(err);
        console.log("Langs submitted");
      });
    });

    mongoose.set("strictQuery", false);
    await mongoose.connect(process.env.MONGO_URL + "landina_account");
    console.log("connected to database.");
  } catch (err) {
    console.log(err, "could not connect to database.");
  }
}

module.exports = { connection };
