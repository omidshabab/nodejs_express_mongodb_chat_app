const multer = require("multer");

const upload = multer({ dest: "./uploads/temp/" });

module.exports = { upload };
