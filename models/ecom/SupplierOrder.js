const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    userOrderId: { type: mongoose.Types.ObjectId },
    products: [
      {
        productId: { type: String },
        name: { type: String },
        image: { type: String },
        quantity: { type: Number },
        price: { type: Number },
      },
    ],
    totalPaid: { type: Number },
    transactionId: { type: mongoose.Types.ObjectId },
  },
  {
    timestamps: true,
  }
);

const SupplierOrderEcom = mongoose.model("SupplierOrderEcom", orderSchema);

module.exports = SupplierOrderEcom;
