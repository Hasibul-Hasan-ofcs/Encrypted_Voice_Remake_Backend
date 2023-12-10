const express = require("express");
const { authentication } = require("../middlewares/authMiddlewares");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
} = require("../controllers/chatControllers");

const chatRouter = express.Router();

chatRouter.route("/").post(authentication, accessChat);
chatRouter.route("/").get(authentication, fetchChats);
chatRouter.route("/group").post(authentication, createGroupChat);
chatRouter.route("/rename").put(authentication, renameGroup);
chatRouter.route("/groupadd").put(authentication, addToGroup);
chatRouter.route("/groupremove").put(authentication, removeFromGroup);

module.exports = chatRouter;
