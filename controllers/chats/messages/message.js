const { landinaChatDB } = require("../../../config/database");
const Message = require("../../../models/Chats/Message/Message");

const createMessage = async (senderId, toId, message) => {
  if (
    senderId == undefined ||
    toId == undefined ||
    message == undefined ||
    message == ""
  ) {
    return null;
  }

  try {
    await Message.save();
  } catch (err) {
    console.error(err);
    return err;
  }
};

exports.default = { createMessage };
