const { User } = require("../models/User");

/* CREATE */
async function sendMessageOffline(fromId, toId, message) {
  if (
    (fromId == undefined, toId == undefined, message == undefined) ||
    message == ""
  ) {
    return null;
  }

  try {
    const user = await User.findById(userId);

    if (user) {
      return {
        status: "success",
        data: {
          _id: user._id,
          name: user.name,
          username: user.username,
        },
      };
    } else {
      return {
        status: "failed",
        data: "User not found!",
      };
    }
  } catch (err) {
    if (err) console.log(err);
  }
}

/* READ */
async function getOfflineMessages(userId) {
  try {
    const user = await User.findById(userId);

    if (user) {
      return {
        status: "success",
        data: {
          _id: user._id,
          name: user.name,
          username: user.username,
        },
      };
    } else {
      return {
        status: "failed",
        data: "User not found!",
      };
    }
  } catch (err) {
    if (err) console.log(err);
  }
}

/* DELETE */
async function clearOfflineMessages(userId) {
  try {
    const user = await User.findById(userId);

    if (user) {
      return {
        status: "success",
        data: {
          _id: user._id,
          name: user.name,
          username: user.username,
        },
      };
    } else {
      return {
        status: "failed",
        data: "User not found!",
      };
    }
  } catch (err) {
    if (err) console.log(err);
  }
}

module.exports = {
  sendMessageOffline,
  getOfflineMessages,
  clearOfflineMessages,
};
