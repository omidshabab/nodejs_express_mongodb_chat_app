const RoomChat = require("../../models/Chats/Room");

/* CREATE */
const createRoom = async (req, res) => {
  try {
    const { name, users } = req.body;
    const room = new Room({
      name,
      users,
    });
    await RoomChat.save();
    res.json({ room });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

/* READ */

/* UPDATE */
const addRoomUsers = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const room = await Room.findById(id);
    if (!room) {
      return res.status(404).send("Room not found");
    }
    room.users.push(userId);
    await room.save();
    res.json({ room });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

/* DELETE */

module.exports = { createRoom, addRoomUsers };
