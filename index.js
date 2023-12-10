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
app.use(express.json());
app.use(cors());
console.log(process.env.NODE_ENV);

connectingMongoDB();

app.use("/", (req, res) => res.send("welcome to encrypted voice"));
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, console.log(`server running at ${PORT}...`));

const socketIO = require("socket.io")(server, {
  pingTimeout: 100000,
  cors: {
    origin: "http://localhost:3001",
  },
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
