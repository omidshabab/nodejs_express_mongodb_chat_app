const { landinaChatDB } = require("../../../config/database");
const Message = require("../../../models/Chats/Message/message");

const createMessage = async (fromId, toId, message) => {
  if (
    fromId == undefined ||
    toId == undefined ||
    message == undefined ||
    message == ""
  ) {
    return null;
  }

  try {
    const newMessage = landinaChatDB
      .collection("messages_" + toId)
      .insertOne(Message);
    return newMessage;
  } catch (err) {
    console.error(err);
    return err;
  }
};

exports.default = { createMessage };
