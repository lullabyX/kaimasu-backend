const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    mobile: {
      type: String,
      // required: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      // required: true
    },
    resetToken: {
      type: String,
    },
    resetTokenTimeout: {
      type: mongoose.Schema.Types.Date,
    },
    bankAccountNo: {
      type: String,
    },
    bankAccountName: {
      type: String,
    },
    bankAccountToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
