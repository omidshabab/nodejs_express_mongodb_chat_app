const mongoose = require("mongoose");
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
