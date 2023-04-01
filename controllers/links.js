const Link = require("../models/Links/Link.js");
const User = require("../models/Accounts/User.js");

/* CREATE */
const createLink = async (req, res) => {
  try {
    const { userId, name, address, desc } = req.body;
    const link = Link({ userId, name, address, desc });
    await link.save();

    const user = await User.findById({ _id: userId });
    await user.updateOne({ $push: { links: link._id } });

    res.status(200).json(link);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* READ */
const getLinks = async (req, res) => {
  try {
    const links = await Link.find({}).sort({ $natural: -1 });
    if (links.length === 0) {
      res.status(404).json("Not found any link");
    } else {
      res.status(200).json(links);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* UPDATE */
const updateLink = async (req, res) => {
  try {
    const { linkId } = req.params;
    const { userId } = req.body;
    const link = await Link.findById(linkId);
    if (link.userId == userId) {
      await link.updateOne({ $set: req.body });
      res.status(200).json("The link has been updated");
    } else {
      res.status(403).json("You can update only your links");
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* DELETE */

module.exports = {
  createLink,
  getLinks,
  updateLink,
};
