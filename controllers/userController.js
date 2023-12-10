const e_asyncHandler = require("express-async-handler");
const userModel = require("../models/userModel");
const generateToken = require("../configuration/generateToken");

const userSignup = e_asyncHandler(async (req, res) => {
  const { name, email, password, user_image } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please provide data for all the required field.");
  }

  const userExists = await userModel.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists.");
  }

  const user = await userModel.create({
    name,
    email,
    password,
    // user_image,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      user_image: user.user_image,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("User creation failed");
  }
});

const userLogin = e_asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      user_image: user.user_image,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password.");
  }
});

const allUsers = e_asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  // search other users except the current user
  const user = await userModel
    .find(keyword)
    .find({ _id: { $ne: req.user._id } });

  res.send(user);
});

module.exports = { userSignup, userLogin, allUsers };
