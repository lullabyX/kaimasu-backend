const mongoose = require("mongoose");

const transactionSchema = mongoose.Schema(
  {
    from: {
      type: mongoose.Types.ObjectId,
      ref: "BankUser",
      required: true,
    },
    to: {
      type: mongoose.Types.ObjectId,
      ref: "BankUser",
      require: true,
    },
    products: [
      {
        productId: { type: String },
        name: { type: String },
        price: { type: Number },
        quantity: { type: Number },
        image: { type: String },
      },
    ],
    totalAmount: { type: Number },
  },
  {
    timestamps: true,
  }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
