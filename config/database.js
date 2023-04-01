const mongoose = require("mongoose");

/* MODELS */
const Category = require("../models/Coupons/Category.js");
const Language = require("../models/Language.js");

/* DATA */
const categories = require("../data/categories.js");
const languages = require("../data/languages.js");
const { config } = require("./config.js");

mongoose.set("strictQuery", false);

const landinaAccountDB = mongoose.createConnection(
  config.landinaAccountDB.url,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const landinaChatDB = mongoose.createConnection(config.landinaChatDB.url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = {
  landinaAccountDB,
  landinaChatDB,
};
