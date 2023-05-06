const socket = require("socket.io");
const { User } = require("./models/Users/User");
const Message = require("./models/Chats/Message/Message");
const PeerToPeerChat = require("./models/Chats/PeerToPeer");

let io;
const connectedUsers = [];

class SocketUser {
  constructor({ socketId, userId, username, token, name }) {
    this.socketId = socketId;
    this.userId = userId;
    this.username = username;
    this.token = token;
    this.name = name;
  }
}

module.exports = SocketUser;

const connectSocket = (server) => {
  io = socket(server);

  io.on("connection", async (socket) => {
    const userId = socket.handshake.query.userId;

    const existingUser = await User.findById(userId);
    if (!existingUser) {
      socket.disconnect();
      return;
    }

    const user = new SocketUser({
      socketId: socket.id,
      userId: existingUser._id,
      username: existingUser.username,
      name: existingUser.name,
      // token: token,
    });

    connectedUsers.push(user);
    console.log(`new socket connection (${user.username}: ${user.userId}))`);

    /* SEND MESSAGE ON PRIVATE CHAT */
    socket.on("send-private", async (event) => {
      const filteredUsers = connectedUsers.filter(
        (elem) => elem.userId == event.to
      );
      if (filteredUsers.length > 0) {
        filteredUsers.forEach((socketItem) => {
          socket.broadcast.to(socketItem.socketId).emit("onMessage", {
            message: event.message,
            from: user,
          });
          console.log(
            `user ${user.userId} sent a message to ${socketItem.socketId} > ${event.message}`
          );
        });
      }
    });

    /* SEND MESSAGE ON PEER TO PEER CHAT */
    socket.on("send-peer-to-peer", async (event) => {
      const toUser = await User.findById(event.to);
      if (!toUser) {
        socket.disconnect();
        return;
      }

      //

      const filteredUsers = connectedUsers.filter(
        (elem) => elem.userId == event.to
      );

      filteredUsers.forEach((socketItem) => {
        socket.broadcast.to(socketItem.socketId).emit("onMessage", {
          message: event.message,
          from: user,
        });
        console.log(
          `user ${user.userId} sent a message to ${socketItem.socketId} > ${event.message}`
        );
      });

      //

      const newMessage = Message({
        senderId: userId,
        content: event.message,
        toId: event.to,
      });
      await newMessage.save();

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

      const existingUserChat = await User.findOne({
        _id: user.userId,
        chats: existingPeerToPeerChat,
      });

      if (!existingUserChat) {
        await User.updateOne(
          { _id: user.userId },
          { $push: { chats: existingPeerToPeerChat } }
        );
        console.log(`New user chat saved`);
      }

      //

      const existingToUserChat = await User.findOne({
        _id: toUser._id,
        chats: existingPeerToPeerChat,
      });

      if (!existingToUserChat) {
        await User.updateOne(
          { _id: toUser._id },
          { $push: { chats: existingPeerToPeerChat } }
        );
        console.log(`New to user chat saved`);
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
