const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    user_image: {
      type: String,
      // required: true,
      default: `https://firebasestorage.googleapis.com/v0/b/encryptedvoicechatapp.appspot.com/o/default_profile_images%2Fmale.png?alt=media&token=26a20e8f-648d-4d61-83e4-7462c9e010d4`,
    },
  },
  {
    timestamps: true,
  }
);

// match password
userSchema.methods.matchPassword = async function (loginPassword) {
  return await bcrypt.compare(loginPassword, this.password);
};

// password encription
userSchema.pre("save", async function (next) {
  if (!this.isModified()) {
    next();
  }

  const salt = await bcrypt.genSalt(15); //the more the number is the stronger the encryption gets
  this.password = await bcrypt.hash(this.password, salt);
});

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
