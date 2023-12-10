const express = require("express");
const { authentication } = require("../middlewares/authMiddlewares");
const {
  sendMessage,
  allMessages,
} = require("../controllers/messageController");

const messageRouter = express.Router();

messageRouter.route("/").post(authentication, sendMessage);
messageRouter.route("/:chatId").get(authentication, allMessages);

module.exports = messageRouter;
