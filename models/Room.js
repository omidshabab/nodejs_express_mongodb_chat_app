const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RoomSchema = Schema(
  {
    userId: {
      //
    },
    socketId: {
      //
    },
    name: {
      //
    },
    desc: {
      //
    },
    createdAtLocation: {
      //
    },
  },
  { timestamps: true }
);

const Room = mongoose.model("Room", RoomSchema);
module.exports = Room;
