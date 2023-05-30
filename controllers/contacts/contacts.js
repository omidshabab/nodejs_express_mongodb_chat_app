const HTTP_STATUS = require("../../config/status.js");
const { Contact } = require("../../models/Contacts/Contact.js");
const { User } = require("../../models/Users/User.js");

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
    const { userId } = req.body;
    const user = await User.findById( userId );

    if (user) {
      res.status(200).json({
        status: HTTP_STATUS.OK,
        data: {
          userId: user._id,
          name: user.name,
          username: user.username,
        },
      });
    } else {
      res.status(404).json({
        status: HTTP_STATUS.NOT_FOUND,
        data: "User not found!",
      });
    }
  } catch (err) {
    res.status(500).json({
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
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
