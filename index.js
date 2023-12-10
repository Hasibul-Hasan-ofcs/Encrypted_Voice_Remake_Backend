const express = require("express");
const connectingMongoDB = require("./configuration/mDBConnection");
const cors = require("cors");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const {
  notFound,
  errorHandler,
} = require("./middlewares/errorHandlerMiddleware");
dotenv.config({ path: "./config.env" });

const app = express();
const options = [
  cors({
    origin: '*',
    methods: '*',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
];

app.use(options);
app.use(express.json());
console.log(process.env.NODE_ENV);

connectingMongoDB();

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, console.log(`server running at ${PORT}...`));

const socketIO = require("socket.io")(server, {
  cors: {
    origin: "https://encrypted-voice-remake-frontend.vercel.app",
    methods: ["GET", "POST"],
    transports: ["websocket", "polling"],
    credentials: true,
  },
  allowEIO3: true,
});

socketIO.on("connection", (socket) => {
  console.log("Connected to socket io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("joinroom", (room) => {
    socket.join(room);
    console.log("user joined the room " + room);
  });

  socket.on("newmessage", (messageRecieved) => {
    let chat = messageRecieved.chat;

    if (!chat.users) return console.log("chat.users not found.");

    chat.users.forEach((user) => {
      if (user._id == messageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", messageRecieved);
    });
  });
});
