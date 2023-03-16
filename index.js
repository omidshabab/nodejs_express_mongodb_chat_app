const express = require("express");
const connection = require("./config/database");
const language = require("./middlewares/language");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const app = express();
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server);
const path = require("path");
const { fileURLToPath } = require("url");
const authRoutes = require("./routes/auth.js");
const userRoutes = require("./routes/users.js");
const couponRoutes = require("./routes/coupons.js");
const categoryRoutes = require("./routes/categories.js");
const linkRoutes = require("./routes/links.js");
const contactsRoutes = require("./routes/contacts.js");
const taskRoutes = require("./routes/tasks.js");
const chatsRoutes = require("./routes/chats.js");
const chatgptRoutes = require("./routes/chatgpt.js");
const locationRoutes = require("./routes/links.js");
const storyRoutes = require("./routes/links.js");
const fontRoutes = require("./routes/links.js");
const commentRoutes = require("./routes/comments.js");
const notificationRoutes = require("./routes/notifications.js");
const uploadRoutes = require("./routes/upload.js");
const SocketUser = require("./models/user.socket");
const { User } = require("./models/User");
const { sendMessageOffline } = require("./utils/offline.messages");
const { verifyAPIKey } = require("./middlewares/auth");

/* CONFIGURATIONS */
dotenv.config();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

/* ROUTES */
app.use("/auth", authRoutes);
app.use("/users", verifyAPIKey, userRoutes);
app.use("/coupons", verifyAPIKey, couponRoutes);
app.use("/categories", verifyAPIKey, categoryRoutes);
app.use("/links", verifyAPIKey, linkRoutes);
app.use("/contacts", verifyAPIKey, contactsRoutes);
app.use("/tasks", verifyAPIKey, taskRoutes);
app.use("/chats", verifyAPIKey, chatsRoutes);
app.use("/chatgpt", verifyAPIKey, chatgptRoutes);
app.use("/locations", verifyAPIKey, locationRoutes);
app.use("/stories", verifyAPIKey, storyRoutes);
app.use("/fonts", verifyAPIKey, fontRoutes);
app.use("/comments", verifyAPIKey, commentRoutes);
app.use("/notifications", verifyAPIKey, notificationRoutes);
app.use("/upload", verifyAPIKey, uploadRoutes);

/* SERVICES */
language;

/* MONGOOSE SETUP */
(async () => await connection())();

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
          status: STATUS.Success,
          data: {
            _id: user._id,
            name: user.name,
            username: user.username,
          },
        };
      } else {
        return {
          status: STATUS.Failed,
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
  console.log(`a new socket connection (${user.username})`);

  /* SEND PRIVATE MESSAGE */
  socket.on("send-private-message", (event) => {
    switch (event) {
      case "single_chat":
        const filteredUsers = users.filter((elem) => elem.username == event.to);
        if (filteredUsers.length > 0) {
          filteredUsers.forEach((socketItem) => {
            socket.broadcast.to(socketItem.socketId).emit("onMessage", {
              message: event.message,
              from: user,
            });
            console.log(
              `user ${user.username} sent a message to ${socketItem.username}`
            );
          });
        } else {
          sendMessageOffline(user.userId, event.message);
          console.log(
            `user ${user.username} sent a offline message to ${event.to}`
          );
        }
      case "room_chat":
        io.to(`ROOMID::${event.roomId}`).emit("onMessage", {
          message: event.message,
          from: user,
          roomId: event.roomId,
        });
        saveMessagesInRoom(event.roomId, user.userId, event.message);
    }
  });

  /* DELETE PRIVATE MESSAGE */
  socket.on("delete-message", (event) => {
    switch (event) {
      case "single_chat":
        const filteredUsers = users.filter((elem) => elem.username == event.to);
        if (filteredUsers.length > 0) {
          filteredUsers.forEach((socketItem) => {
            socket.broadcast.to(socketItem.socketId).emit("onMessage", {
              message: event.message,
              from: user,
            });
            console.log(
              `user ${user.username} sent a message to ${socketItem.username}`
            );
          });
        } else {
          sendMessageOffline(user.userId, event.message);
          console.log(
            `user ${user.username} sent a offline message to ${event.to}`
          );
        }
      case "room_chat":
        io.to(`ROOMID::${event.roomId}`).emit("onMessage", {
          message: event.message,
          from: user,
          roomId: event.roomId,
        });
        saveMessagesInRoom(event.roomId, user.userId, event.message);
      case "private_chat":
        break;
      case "one_way_chat":
        break;
      case "bot_chat":
        break;
      default:
        break;
    }
  });

  /* SEND PUBLIC MESSAGE */
  socket.on("send-public-message", (event) => {
    switch (event) {
      case "single_chat":
        const filteredUsers = users.filter((elem) => elem.username == event.to);
        if (filteredUsers.length > 0) {
          filteredUsers.forEach((socketItem) => {
            socket.broadcast.to(socketItem.socketId).emit("onMessage", {
              message: event.message,
              from: user,
            });
            console.log(
              `user ${user.username} sent a message to ${socketItem.username}`
            );
          });
        } else {
          sendMessageOffline(user.userId, event.message);
          console.log(
            `user ${user.username} sent a offline message to ${event.to}`
          );
        }
      case "room_chat":
        io.to(`ROOMID::${event.roomId}`).emit("onMessage", {
          message: event.message,
          from: user,
          roomId: event.roomId,
        });
        saveMessagesInRoom(event.roomId, user.userId, event.message);
      case "private_chat":
        break;
      case "one_way_chat":
        break;
      case "bot_chat":
        break;
      default:
        break;
    }
  });

  /* UPDATE PUBLIC MESSAGE */
  socket.on("update-public-message", (event) => {
    //
  });

  /* DELETE PUBLIC MESSAGE */
  socket.on("delete-public-message", (event) => {
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

  /* JOIN A ROOM */
  socket.on("join-room", (event) => {
    socket.join(`ROOMID::${event.roomId}`);
    console.log(`user ${user.userId} joined to ${event.roomId} room`);
  });

  /* LEAVE A ROOM */
  socket.on("leave-room", (event) => {
    socket.leave(`ROOMID::${event.roomId}`);
    console.log(`user ${user.userId} left to ${event.roomId} room`);
  });

  /* USER NETWORK STATUS */
  socket.on("user-status", (event) => {
    switch (event.status) {
      case "online":
        break;
      case "offline":
        break;
      case "typing":
        break;
      case "sending_file":
        break;
      default: // OFFLINE
        break;
    }
  });

  /* DISCONNECT */
  socket.on("disconnect", (event) => {
    console.log(`user (${user.username}) disconnected`);
    const index = users.indexOf((elem) => elem.userId === userId);
    users.slice(index, 1);
  });
});
