const socket = require("socket.io");
const { User } = require("./models/Users/User");
const Message = require("./models/Chats/Message/Message");
const PeerToPeerChat = require("./models/Chats/PeerToPeer");

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
    console.log(`new socket connection (${user.username}: ${user._id})`);

    /* SEND MESSAGE ON PRIVATE CHAT */
    io.on("send-private", (event) => {
      const filteredUsers = connectedUsers.filter(
        (elem) => elem.userId == event.to
      );
      if (filteredUsers.length > 0) {
        filteredUsers.forEach((socketItem) => {
          io.broadcast.to(socketItem.socketId).emit("message", {
            message: event.message,
            from: user,
          });
          console.log(
            `user ${user.userId} sent a message to ${socketItem.userId}`
          );
        });
      } else {
        // OFFLINE MESSAGE
        // console.log(
        //   `user ${user.userId} sent an offline message to ${event.to}`
        // );
      }
    });

    /* SEND MESSAGE ON PEER TO PEER CHAT */
    io.on("send-peer-to-peer", async (event) => {
      const toUser = await User.findById(event.to);
      if (!toUser) {
        socket.disconnect();
        return;
      }

      //

      const newMessage = Message({
        senderId: userId,
        content: event.message,
        toId: event.to,
      });
      await newMessage.save();

      //

      // io.to(socket.id).emit("message", {
      //   message: event.message,
      //   from: userId,
      // });
      // console.log(
      //   `user ${user.id} sent a message to ${socket.id} > ${event.message}`
      // );

      io.broadcast.to(socket.io).emit("message", {
        message: event.message,
        from: userId,
      });
      console.log(
        `user ${user.id} sent a message to ${socket.id} > ${event.message}`
      );

      // for (const user of connectedUsers) {
      //   io.to(socket.id).emit("message", {
      //     message: event.message,
      //     from: userId,
      //   });
      //   console.log(
      //     `user ${user.id} sent a message to ${socket.id} > ${event.message}`
      //   );
      // }

      //

      const existingPeerToPeerChat = await PeerToPeerChat.findOne({
        between: { $all: [userId, event.to] },
      });

      if (existingPeerToPeerChat) {
        existingPeerToPeerChat.messages.push(newMessage);
        await existingPeerToPeerChat.save();
      } else {
        const newPeerToPeerChat = PeerToPeerChat({
          between: [userId, event.to],
          messages: [newMessage],
        });
        await newPeerToPeerChat.save();
      }

      //

      const existingUserChat = await User.findOne({
        // id: user._id,
        chats: { $all: [existingPeerToPeerChat] },
      });
      if (existingUserChat) {
        existingUserChat.chats.push(existingPeerToPeerChat);
        await existingUserChat.save();
      } else {
        const newUserChat = User({
          chats: [existingPeerToPeerChat],
        });
        await newUserChat.save();
      }

      //

      const existingToUserChat = await User.findOne({
        // id: user._id,
        chats: { $all: [existingPeerToPeerChat] },
      });
      if (existingToUserChat) {
        existingToUserChat.chats.push(existingPeerToPeerChat);
        await existingToUserChat.save();
      } else {
        const newToUserChat = User({
          chats: [existingPeerToPeerChat],
        });
        await newToUserChat.save();
      }
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
