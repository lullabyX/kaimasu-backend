const mongoose = require("mongoose");

const cartSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        productId: { type: String },
        name: { type: String },
        image: { type: String },
        quantity: { type: Number },
        price: { type: Number },
      },
    ],
    totalItems: {
      type: Number,
    },
    totalPaid: {
      type: Number,
    },
    Address: {
      FullName: { type: String },
      Region: { type: String },
      City: { type: String },
      Area: { type: String },
      Address: { type: String },
      PhoneNumber: { type: String },
    },
    transactionId: { type: mongoose.Types.ObjectId },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", cartSchema);

module.exports = Order;
