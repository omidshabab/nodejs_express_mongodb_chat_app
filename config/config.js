const dotenv = require("dotenv");
dotenv.config();

const config = {
  landinaAccountDB: {
    url: process.env.LANDINA_ACCOUNT_MONGO_DB_URL,
    name: "landina_account",
  },
  landinaChatDB: {
    url: process.env.LANDINA_CHAT_MONGO_DB_URL,
    name: "landina_chat",
  },
};

module.exports = { config };
