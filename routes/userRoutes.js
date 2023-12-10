const express = require("express");
const {
  userSignup,
  userLogin,
  allUsers,
} = require("../controllers/userController");
const { authentication } = require("../middlewares/authMiddlewares");

const userRouter = express.Router();

userRouter.route("/").post(userLogin).get(authentication, allUsers);
userRouter.route("/signup").post(userSignup);

module.exports = userRouter;
