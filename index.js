const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const app = express();
const http = require("http");
const server = http.createServer(app);
const multer = require("multer");
const path = require("path");
const { fileURLToPath } = require("url");
const authRoutes = require("./routes/auth/auth.js");
const userRoutes = require("./routes/users/users.js");
const contactsRoutes = require("./routes/contacts/contacts.js");
const notificationRoutes = require("./routes/notifications/notifications.js");
const { verifyAPIKey } = require("./middlewares/auth.js");
const mongoose = require("mongoose");
const { config } = require("./config/config");
const { connectSocket } = require("./socket.js");

/* CONFIGURATIONS */
dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "peer-to-peer/assets")));

/* ROUTES */
app.use("/auth", authRoutes);
app.use("/users", /* verifyAPIKey, */ userRoutes);
app.use("/contacts", contactsRoutes);
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
connectSocket(server);
