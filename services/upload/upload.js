const path = require("path");
const fs = require("fs");
const { User } = require("../../models/Users/User.js");

const profile = async (req, res) => {
  let userId = req.header("userId");
  const profile = req.file;
  const targetPath = path.join(
    __dirname,
    `../uploads/images/profiles/${userId}.jpg`
  );

  fs.rename(profile.path, targetPath, (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      fs.unlink(profile.path, () => {});
      User.findByIdAndUpdate(userId, {
        image: targetPath,
      });
      res.status(200).json(`Profile Uploaded on: ${targetPath}`);
    }
  });
};

module.exports = {
  profile,
};
