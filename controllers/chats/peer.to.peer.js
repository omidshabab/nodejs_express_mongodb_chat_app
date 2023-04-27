const PeerToPeerChat = require("../../models/Chats/PeerToPeer");

exports.getChats = async (req, res) => {
  try {
    const { from, to } = req.query;

    const chats = await PeerToPeerChat.find({
      $or: [
        { from: from, to: to },
        { from: to, to: from },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json({ chats });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.saveChat = async (from, to, message) => {
  try {
    const chat = new PeerToPeerChat({ from, to, message });
    await chat.save();
  } catch (error) {
    console.error(error);
  }
};
