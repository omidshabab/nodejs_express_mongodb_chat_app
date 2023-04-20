const i18n = require("i18n");
const path = require("path");

i18n.configure({
  locales: ["en", "fr", "fa"],
  directory: path.join(__dirname, "..", "app", "locales"),
  defaultLocale: "en",
  cookie: "lang",
  queryParameter: "lang",
  register: global,
  updateFiles: false,
  api: {
    __: "translate",
    __n: "translateN",
  },
});

module.exports = i18n;
