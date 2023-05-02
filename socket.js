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
    console.log(
      `new socket connection (${user.username}: ${user._id}), socket.id is (${socket.id})`
    );

    const userChats = PeerToPeerChat.watch();
    io.on("user-chats", (event) => {
      console.log("Change detected:", event);
      io.emit("user-chats", userChats);
    });

    /* SEND MESSAGE ON PRIVATE CHAT */
    socket.on("send-private", async (event) => {
      io.to(socket.id).emit("message", {
        message: event.message,
        from: user,
      });
      console.log(`user ${userId} sent a message to ${socket.id}`);
    });

    /* SEND MESSAGE ON PEER TO PEER CHAT */
    socket.on("send-peer-to-peer", async (event) => {
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

      socket.to(socket.id).emit("message", {
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

      const newPeerToPeerChat = PeerToPeerChat({
        between: [userId, event.to],
        messages: [newMessage],
      });

      const existingPeerToPeerChat = await PeerToPeerChat.findOne({
        between: { $all: [userId, event.to] },
      });

      if (existingPeerToPeerChat) {
        existingPeerToPeerChat.messages.push(newMessage);
        await existingPeerToPeerChat.save();
      } else {
        await newPeerToPeerChat.save();
      }

      //

      const newUserChat = User({
        chats: [existingPeerToPeerChat],
      });

      const existingUserChat = await User.findOne({
        id: user._id,
        chats: { $all: [existingPeerToPeerChat] },
      });
      console.log("User is: ${user}");
      if (existingUserChat) {
        existingUserChat.chats.push(existingPeerToPeerChat);
        await existingUserChat.save();
      } else {
        await newUserChat.save();
      }

      //

      const newToUserChat = User({
        chats: [existingPeerToPeerChat],
      });

      const existingToUserChat = await User.findOne({
        id: user._id,
        chats: { $all: [existingPeerToPeerChat] },
      });
      if (existingToUserChat) {
        existingToUserChat.chats.push(existingPeerToPeerChat);
        await existingToUserChat.save();
      } else {
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
