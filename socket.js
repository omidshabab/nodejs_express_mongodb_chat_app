const socket = require("socket.io");
const { User } = require("./models/Users/User.js");
const Message = require("./models/Chats/Message/message.js");
const PeerToPeerChat = require("./models/Chats/PeerToPeer.js");

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
    console.log(`new socket connection (${user.name}: ${user.username})`);

    /* ONLINE */
    socket.on("online", data => {
      socket.broadcast.emit("online", data); // return data
    });

    /* UPLOADING */
    socket.on("uploading", data => {
      socket.broadcast.emit("uploading", data); // return data
    });

    /* TYPING */
    socket.on("typing", data => {
      socket.broadcast.emit("typing", data); // return data
    });

    /* SEND MESSAGE ON PRIVATE CHAT */
    socket.on("send-message", async (event) => {
      if (!!event.roomId) {
        io.to(`ROOMID::${event.roomId}`).emit("onMessage", {
          message: event.message,
          from: user,
          roomId: event.roomId,
        });
      } else if (!!event.peerId) {
        const toUser = await User.findById(event.to);
        if (!toUser) {
          socket.disconnect();
          return;
        }

        //

        socket.to(event.peerId).emit("onMessage", {
          message: event.message,
          from: user,
          peerId: event.roomId,
        });
        console.log(
          `user ${user.username} sent a message to ${toUser.username} > ${event.message}`
        );

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
      } else if (!!event.botId) {
        //
      } else if (!!event.onewayId) {
        //
      } else {
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
      }
    });

    /* JOIN A ROOM CHAT */
    socket.on("join-room", async (event) => {
      socket.join(`ROOMID::${event.roomId}`);
      console.log(`user ${user.userId} join to a room ${event.roomId}`);
    });

    /* JOIN A ROOM CHAT */
    socket.on("join-room", async (event) => {
      socket.join(`ROOMID::${event.roomId}`);
      console.log(`user ${user.userId} join to a room ${event.roomId}`);
    });

    /* LEAVE A ROOM CHAT */
    socket.on("leave-room", (event) => {
      socket.leave(`ROOMID::${event.roomId}`);
      console.log(`user ${user.userId} left the room ${event.roomId}`);
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
