const dotenv = require("dotenv");
dotenv.config();

const config = {
  db: {
    url: process.env.MONGO_URL,
    name: "landina_account",
  },
};

module.exports = { config };
