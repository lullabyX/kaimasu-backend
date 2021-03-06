const createHttpError = require("http-errors");
const SupplierOrder = require("../../models/supplier/SupplierOrder");
const axios = require("axios");
require("dotenv").config();

exports.putOrder = async (req, res, next) => {
  const transactionId = req.body.transactionId;
  try {
    // confirm from bank
    const response = await axios.get(
      process.env.BANKAPIENDPOINT + "/transaction/" + transactionId
    );
    console.log(response);
    if (response.status !== 200) {
      return next(
        createHttpError(500, "Transaction not found with given transactionId")
      );
    }
    // create order
    const order = new SupplierOrder({
      products: response.data.transaction.products,
      totalAmount: response.data.transaction.totalAmount,
      transactionId: transactionId,
    });
    await order.save();
    res.status(201).json({
      message: "Order placed at supplier",
      order: order,
    });
    //supply order -> call ecom
    const orderConfirmResponse = await axios.post(
      process.env.ECOMAPIENDPOINT + "/shop/order",
      {
        transactionId: order.transactionId,
      }
    );
    console.log(orderConfirmResponse);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
