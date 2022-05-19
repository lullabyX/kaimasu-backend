const SupplierOrder = require("../../models/supplier/SupplierOrder");

exports.putOrder = async (req, res, next) => {
  const products = req.body.products;
  const transactionId = req.body.transactionId;
  try {
    // confirm from bank

    const order = new SupplierOrder({
      products: products,
      transactionId: transactionId,
    });
    await order.save();
    res.status(201).json({
      message: "Order placed at supplier",
      order: order,
    });
    //supply order -> call ecom
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
