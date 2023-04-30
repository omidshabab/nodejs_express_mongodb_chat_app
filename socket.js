const socket = require("socket.io");
const { User } = require("./models/Users/User");
const Message = require("./models/Chats/Message/Message");
const PeerToPeerChat = require("./models/Chats/PeerToPeer");
const { landinaAccountDB } = require("./config/database");

let io;
const connectedUsers = [];

const connectSocket = (server) => {
  io = socket(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", async (socket) => {
    const userId = socket.handshake.query.userId;

    const user = await User.findById(userId);
    if (!user) {
      socket.disconnect();
      return;
    }

    connectedUsers.push(user);
    console.log(`a new socket connection (${user.username}: ${user._id})`);

    /* SEND MESSAGE ON PRIVATE CHAT */
    socket.on("send-private", (event) => {
      const filteredUsers = connectedUsers.filter(
        (elem) => elem.userId == event.to
      );
      if (filteredUsers.length > 0) {
        filteredUsers.forEach((socketItem) => {
          socket.broadcast.to(socketItem.socketId).emit("message", {
            message: event.message,
            from: user,
          });
          console.log(
            `user ${user.userId} sent a message to ${socketItem.userId}`
          );
        });
      } else {
        // OFFLINE MESSAGE
        console.log(
          `user ${user.userId} sent an offline message to ${event.to}`
        );
      }
    });

    /* SEND MESSAGE ON PEER TO PEER CHAT */
    socket.on("send-peer-to-peer", async ({ to, message }) => {
      console.log(`Socket id is: ${socket.id}`);

      const newMessage = Message({
        senderId: userId,
        content: message,
        toId: to,
      });
      await newMessage.save();
      console.log(`This is new message: ${newMessage}`);

      //

      const existingPeerToPeerChat = await PeerToPeerChat.findOne({
        between: { $all: [userId, to] },
      });

      if (existingPeerToPeerChat) {
        existingPeerToPeerChat.messages.push(newMessage);
        await existingPeerToPeerChat.save();
        console.log(`This is updated chat: ${existingPeerToPeerChat}`);
      } else {
        const newPeerToPeerChat = PeerToPeerChat({
          between: [userId, to],
          messages: [newMessage],
        });
        await newPeerToPeerChat.save();
        console.log(`This is new chat: ${newPeerToPeerChat}`);
      }

      //

      const existingUserChat = User.findOne({
        id: user._id,
        chats: { $all: [existingPeerToPeerChat._id] },
      });
      console.log(`existingUserChat is: ${existingUserChat}`);
      if (!existingUserChat) {
        user.chats.push(existingPeerToPeerChat);
        await user.save();
      } else {
        console.log(`user chats already exist`);
      }
      console.log(`User existing chats: ${user.chats}`);

      //

      const toUser = await User.findById(to);
      if (!toUser) {
        socket.disconnect();
        return;
      }
      const existingToUserChat = User.findOne({
        id: toUser._id,
        chats: { $all: [existingPeerToPeerChat._id] },
      });
      console.log(`existingToUserChat is: ${existingToUserChat}`);
      if (!existingToUserChat) {
        toUser.chats.push(existingPeerToPeerChat);
        await toUser.save();
      } else {
        console.log(`user chats already exist`);
      }
      console.log(`To user existing chats: ${toUser.chats}`);

      //

      io.emit("message", {
        senderId: newMessage.senderId,
        content: newMessage.content,
        toId: newMessage.toId,
      });
    });

    /* SEND MESSAGE ON ROOM CHAT */
    socket.on("send-room", async ({ roomId, message }) => {
      try {
        const { senderId, content } = message;
        const room = await Room.findById(roomId);

        if (!room) {
          return socket.emit("error", "Room not found");
        }

        const newMessage = new Message({
          senderId,
          roomId,
          content,
        });
        await newMessage.save();

        room.messages.push(newMessage._id);
        await room.save();
      } catch (err) {
        console.log(err);
        socket.emit("error", "Server error");
      }
    });

    /* SEND NOTIFICATION */
    socket.on("notification", (event) => {
      //
    });

    /* JOIN A ROOM CHAT */
    socket.on("join-room", async (roomId) => {
      try {
        const room = await Room.findById(roomId);
        if (!room) {
          return socket.emit("error", "Room not found");
        }
        socket.join(roomId);
        roomSocket[roomId] = roomSocket.roomId || [];
        roomSocket[roomId].push(socket);

        const messages = await Message.find({ roomId }).populate("senderId");
        socket.emit("messages", messages);
      } catch (err) {
        //
      }
    });

    /* LEAVE A ROOM CHAT */
    socket.on("leave-room", (roomId) => {
      socket.leave(roomId);
      roomSocket[roomId] = roomSocket[roomId].filter((s) => s !== socket);
    });

    /* DISCONNECT */
    socket.on("disconnect", (event) => {
      console.log(`user (${user.username}) disconnected`);
      const index = connectedUsers.indexOf((elem) => elem.userId === userId);
      connectedUsers.slice(index, 1);
    });
  });
};

module.exports = { connectSocket };
