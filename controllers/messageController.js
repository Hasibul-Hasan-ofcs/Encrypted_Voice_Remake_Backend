const e_asyncHandler = require("express-async-handler");
const userModel = require("../models/userModel");
const MessageModel = require("../models/messageModel");
const ChatModel = require("../models/chatModel");

const sendMessage = e_asyncHandler(async (req, res) => {
  const { messageData, chatId } = req.body;

  if (!messageData || !chatId) {
    console.log("Invalid data send");
    return res.sendStatus(400);
  }

  let newMessage = {
    sender: req.user._id,
    content: messageData,
    chat: chatId,
  };

  try {
    let message = await MessageModel.create(newMessage);
    message = await message.populate("sender", "name user_image");
    message = await message.populate("chat");
    message = await userModel.populate(message, {
      path: "chat.users",
      select: "name user_image email",
    });

    await ChatModel.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const allMessages = e_asyncHandler(async (req, res) => {
  try {
    const messages = await MessageModel.find({ chat: req.params.chatId })
      .populate("sender", "name user_image email")
      .populate("chat");

    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = { sendMessage, allMessages };
