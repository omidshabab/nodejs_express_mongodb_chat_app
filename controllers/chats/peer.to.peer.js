const PeerToPeerChat = require("../../models/Chats/PeerToPeer");

/* CREATE */

/* READ */
const getChats = async (req, res) => {
  try {
    const { from, to } = req.body;

    const chats = await PeerToPeerChat.find({
      $or: [
        { from: from, to: to },
        { from: to, to: from },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json({ chats });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

/* UPDATE */

/* DELETE */

exports.module = { getChats };
