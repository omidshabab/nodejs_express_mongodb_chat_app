const { Contact } = require("../models/Contacts/Contact.js");
const { User } = require("../models/Accounts/User");

/* CREATE */
const createContact = async (req, res) => {
  try {
    //
  } catch (err) {
    res.status(500).json({
      status: "failed",
      data: err.message,
    });
  }
};

const addContacts = async (req, res) => {
  try {
    const { username } = req.body;
    const user = await User.findOne({ username });

    if (user) {
      res.status(200).json({
        status: "success",
        data: {
          userId: user._id,
          name: user.name,
          username: user.username,
        },
      });
    } else {
      res.status(404).json({
        status: "failed",
        data: "User not found!",
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "failed",
      data: err.message,
    });
  }
};

/* READ */
const getContacts = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (user) res.status(200).json("user found");
  } catch (err) {
    res.status(500).json({
      status: "failed",
      data: err.message,
    });
  }
};

/* UPDATE */
const updateContact = async (req, res) => {
  try {
    //
  } catch (err) {
    res.status(500).json({
      status: "failed",
      data: err.message,
    });
  }
};

/* DELETE */
const deleteContact = async (req, res) => {
  try {
    //
  } catch (err) {
    res.status(500).json({
      status: "failed",
      data: err.message,
    });
  }
};

module.exports = {
  createContact,
  addContacts,
  getContacts,
  updateContact,
  deleteContact,
};
