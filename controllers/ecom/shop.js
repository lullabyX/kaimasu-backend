const createHttpError = require("http-errors");
const { default: mongoose } = require("mongoose");
const axios = require("axios");
const Cart = require("../../models/ecom/Cart");
const User = require("../../models/ecom/Users");
const Order = require("../../models/ecom/Order");
const SupplierOrderEcom = require("../../models/ecom/SupplierOrder");

require("dotenv").config();

exports.getCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({
      userId: req.userId,
    });

    res.status(200).json({
      cart: cart,
      userId: req.userId,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.postCart = async (req, res, next) => {
  const productId = req.body.productId || "";
  const productName = req.body.productName || "";
  const productPrice = req.body.productPrice || "";
  const productImage = req.body.productImage || "";
  let productQuantity = req.body.productQuantity || 1;
  try {
    let cart = await Cart.findOne({
      userId: mongoose.Types.ObjectId(req.userId),
    });
    if (!cart) {
      const user = await User.findById(req.userId);
      if (!user) {
        return next(createHttpError(500, "User not found while creating cart"));
      }
      cart = new Cart({ userId: user._id });
    }
    const products = cart.products;
    // console.log(products);
    cart.totalItems += +productQuantity;

    let product = products.filter(
      (product) => product.productId == productId
    )[0];
    if (product) {
      const oldQty = product.quantity;
      productQuantity = +productQuantity + oldQty;
    }
    updateProduct = {
      productId: productId,
      price: productPrice,
      image: productImage,
      name: productName,
      quantity: productQuantity,
    };

    const indx = products.findIndex(
      (product) => product.productId == productId
    );
    if (indx >= 0) {
      cart.products[indx] = updateProduct;
    } else {
      cart.products.push(updateProduct);
    }
    await cart.save();
    res.status(202).json({
      message: `${product.name} is added to cart`,
      productId: product.id,
      cart: cart,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.checkout = async (req, res, next) => {
  const address = req.body.address;
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return next(createHttpError(500, "User not found while checkout"));
    }
    const cart = await Cart.findOne({ userId: req.userId });
    if (!cart) {
      return next(createHttpError(500, "Cart not found or empty"));
    }

    const response = await axios.put(
      process.env.BANKAPIENDPOINT + "/transaction",
      {
        from: {
          bankAccountNo: user.bankAccountNo,
          bankAccountName: user.bankAccountName,
          bankAccountToken: user.bankAccountToken,
        },
        to: {
          bankAccountNo: process.env.BANKACCOUNTNO,
          bankAccountName: process.env.BANKACCOUNTNAME,
          bankAccountToken: process.env.BANKACCOUNTTOKEN,
        },
        products: cart.products,
      }
    );
    if (response.status !== 201) {
      return next(createHttpError(500, "Transaction failed"));
    }

    fullName = address.FullName || `${user.firstName} ${user.lastName}`;
    const order = new Order({
      userId: user._id,
      products: cart.products,
      totalItems: cart.totalItems,
      totalPaid: response.data.totalAmount,
      transactionId: response.data.transactionId,
      Address: {
        FullName: fullName,
        Region: address.Region,
        City: address.City,
        Area: address.Area,
        Address: address.Address,
        PhoneNumber: address.PhoneNumber,
      },
    });
    await order.save();
    await cart.remove();

    res.status(201).json({
      message: "Your order is placed",
      order: order,
    });

    // call bank api to pay supplier
    const products = order.products.map((product) => {
      return {
        ...product._doc,
        price: product.price * process.env.SUPPLIERCUT,
      };
    });
    const bankResSupplier = await axios.put(
      process.env.BANKAPIENDPOINT + "/transaction",
      {
        to: {
          bankAccountNo: process.env.SUPPLIERBANKACCOUNTNO,
          bankAccountName: process.env.SUPPLIERBANKACCOUNTNAME,
          bankAccountToken: process.env.SUPPLIERBANKACCOUNTTOKEN,
        },
        from: {
          bankAccountNo: process.env.BANKACCOUNTNO,
          bankAccountName: process.env.BANKACCOUNTNAME,
          bankAccountToken: process.env.BANKACCOUNTTOKEN,
        },
        products: products,
      }
    );

    if (bankResSupplier.status !== 201) {
      return next(
        createHttpError(500, "Transaction failed while paying supplier")
      );
    }

    const supplierOrder = new SupplierOrderEcom({
      userOrderId: order._id,
      products: products,
      totalPaid: bankResSupplier.data.totalAmount,
      transactionId: bankResSupplier.data.transactionId,
    });

    await supplierOrder.save();

    const supplierResponse = await axios.put(
      process.env.SUPPLIERAPIENDPOINT + "/order",
      {
        transactionId: supplierOrder.transactionId,
      }
    );

    if (supplierResponse.status !== 201) {
      next(createHttpError(500, "Failed placing order at supplier"));
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.confirmDeliver = async (req, res, next) => {
  const transactionId = req.body.transactionId;
  try {
    const supplierOrder = await SupplierOrderEcom.findOne({
      transactionId: transactionId,
    });
    if (!supplierOrder) {
      return next(
        createHttpError(500, "Order to supplier not found with transactionId")
      );
    }
    const order = await Order.findById(supplierOrder.userOrderId);
    if (!order) {
      return next(createHttpError(500, "User order not found"));
    }
    order.status = "Delivered";
    await order.save();
    res.status(201).json({
      message: "Order delivered",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getProducts = async (req, res, next) => {
  const products = [
    {
      id: 1,
      image: "tea_pot",
      name: "Tea Pot",
      price: 50,
    },
    {
      id: 2,
      image: "mug",
      name: "Mug",
      price: 20,
    },
    {
      id: 3,
      image: "water_bottle",
      name: "Water Bottle",
      price: 30,
    },
  ];

  try {
    res.status(200).json({
      products: products,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
