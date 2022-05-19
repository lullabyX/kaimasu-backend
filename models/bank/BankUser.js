const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
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
    balance: {
      type: Number,
      default: 10000,
    },
  },
  {
    timestamps: true,
  }
);

const BankUser = mongoose.model("BankUser", userSchema);

module.exports = BankUser;
