const jwt = require("jsonwebtoken");
const e_asyncHandler = require("express-async-handler");
const userModel = require("../models/userModel");

const authentication = e_asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // returns data without the password
      req.user = await userModel.findById(decoded.id).select("-password");

      next();
    } catch (err) {
      res.status(401);
      throw new Error("Invalid authorization. Token validation failed.");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Invalid authorization. No token found.");
  }
});

module.exports = { authentication };
