const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const app = express();
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server);
const multer = require("multer");
const path = require("path");
const { fileURLToPath } = require("url");
const authRoutes = require("./routes/auth/auth.js");
const userRoutes = require("./routes/users/users.js");
const linkRoutes = require("./routes/links/links.js");
const contactsRoutes = require("./routes/contacts/contacts.js");
const taskRoutes = require("./routes/tasks/tasks.js");
const locationRoutes = require("./routes/links/links.js");
const storyRoutes = require("./routes/links/links.js");
const fontRoutes = require("./routes/links/links.js");
const notificationRoutes = require("./routes/notifications/notifications.js");
const SocketUser = require("./models/user.socket");
const { User } = require("./models/Users/User.js");
const { sendMessageOffline } = require("./utils/offline.messages");
const { verifyAPIKey } = require("./middlewares/auth.js");
const mongoose = require("mongoose");
const { config } = require("./config/config");
const Bot = require("./models/Chats/Bot");
const OneWay = require("./models/Chats/OneWay");
const PeerToPeer = require("./models/Chats/PeerToPeer");
const Room = require("./models/Chats/Room");
const Message = require("./models/Chats/Message/Message.js");
const createMessage = require("./controllers/chats/messages/message.js");
const { saveChat } = require("./controllers/chats/peer.to.peer.js");

/* CONFIGURATIONS */
dotenv.config();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "peer-to-peer/assets")));

/* ROUTES */
app.use("/auth", authRoutes);
app.use("/users", verifyAPIKey, userRoutes);
app.use("/links", verifyAPIKey, linkRoutes);
app.use("/contacts", verifyAPIKey, contactsRoutes);
app.use("/tasks", verifyAPIKey, taskRoutes);
app.use("/locations", verifyAPIKey, locationRoutes);
app.use("/stories", verifyAPIKey, storyRoutes);
app.use("/fonts", verifyAPIKey, fontRoutes);
app.use("/notifications", verifyAPIKey, notificationRoutes);

/* DATABASE */
mongoose
  .connect(config.landinaAccountDB.url)
  .then(() => console.log(`Connected to ${config.landinaAccountDB.name}`))
  .catch((err) => console.log(err));

/* SERVER SETUP */
const port = process.env.PORT || 6001;
server.listen(port, () => console.log(`Listening on port ${port}...`));

/* SOCKET.IO */
const users = [];
io.on("connection", async (socket) => {
  const userId = socket.handshake.query.userId;

  // Check User is Available
  async function getUser(userId) {
    try {
      const user = await User.findById(userId);

      if (user) {
        return {
          status: "success",
          data: {
            _id: user._id,
            name: user.name,
            username: user.username,
          },
        };
      } else {
        return {
          status: "failed",
          data: "User not found!",
        };
      }
    } catch (err) {
      if (err) console.log(err);
    }
  }
  const getUserById = await getUser(userId);
  if (!getUserById) {
    socket.disconnect();
    return;
  }

  const user = new SocketUser({
    socketId: socket.id,
    userId: getUserById.data._id,
    name: getUserById.data.name,
    username: getUserById.data.username,
  });

  users.push(user);
  console.log(`a new socket connection (${user.username}: ${user.userId})`);

  /* SEND MESSAGE ON PRIVATE CHAT */
  socket.on("send-private-chat", (event) => {
    const filteredUsers = users.filter((elem) => elem.userId == event.to);
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
      console.log(`user ${user.userId} sent an offline message to ${event.to}`);
    }
  });

  /* SEND MESSAGE ON PEER TO PEER CHAT */
  socket.on("send-peer-to-peer-chat", ({ from, to, message }) => {
    saveChat(from, to, message);

    io.to(to).emit("chat", { from, to, message });
  });

  /* SEND MESSAGE ON ROOM CHAT */
  socket.on("send-room-chat", async ({ roomId, message }) => {
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

  /* UPDATE ROOM MESSAGE */
  socket.on("delete-peer-to-peer-message", (event) => {
    //
  });

  /* DELETE ROOM MESSAGE */
  socket.on("delete-peer-to-peer-message", (event) => {
    //
  });

  /* SEND NOTIFICATION */
  socket.on("send-notification", (event) => {
    //
  });

  /* UPDATE NOTIFICATION */
  socket.on("update-notification", (event) => {
    //
  });

  /* DELETE NOTIFICATION */
  socket.on("delete-notification", (event) => {
    //
  });

  /* JOIN A ROOM CHAT */
  socket.on("join-room-chat", async (roomId) => {
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
    const index = users.indexOf((elem) => elem.userId === userId);
    users.slice(index, 1);
  });
});
