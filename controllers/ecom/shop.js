const createHttpError = require("http-errors");
const { default: mongoose } = require("mongoose");
const axios = require("axios");
const Cart = require("../../models/ecom/Cart");
const User = require("../../models/ecom/Users");
const Order = require("../../models/ecom/Order");
const SupplierOrderEcom = require("../../models/ecom/SupplierOrder");
const Transaction = require("../../models/bank/Transactions");
const BankUser = require("../../models/bank/BankUser");
const Products = require("../../models/supplier/Products");

require("dotenv").config();

// let products = [
//   {
//     id: 1,
//     image:
//       "https://res.cloudinary.com/dxaiffb1m/image/upload/v1656585653/Taza-creativa-de-cer-mica-Simple-de-gran-capacidad-para-parejas-de-estilo-japon-s-taza_ou5uwi.jpg",
//     name: "Coffee Mug",
//     quantity: 30,
//     price: 50,
//   },
//   {
//     id: 2,
//     image:
//       "https://res.cloudinary.com/dxaiffb1m/image/upload/v1656586131/5950b2c6186770978ab0607bd33a5c10_jvhm0o.jpg",
//     name: "Tea Cup",
//     quantity: 40,
//     price: 20,
//   },
//   {
//     id: 3,
//     image:
//       "https://res.cloudinary.com/dxaiffb1m/image/upload/v1656586180/81lMl0KeaXL._AC_SL1500__terpfi.jpg",
//     name: "Water Bottle",
//     quantity: 50,
//     price: 30,
//   },
// ];

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
    const cartProducts = cart.products;
    // console.log(products);
    cart.totalItems += +productQuantity;

    let cartProduct = cartProducts.filter(
      (cartProduct) => cartProduct.productId == productId
    )[0];
    if (cartProduct) {
      const oldQty = cartProduct?.quantity;
      productQuantity = +productQuantity + oldQty;
    }

    const products = await Products.find();
    const product = products.filter((product) => product.id == productId)[0];
    if (!product) {
      const error = new Error("Product not found in product list");
      throw error;
    }

    if (product?.quantity < productQuantity) {
      return res.status(401).json({
        message: "Product is not in enough quantity to be added to cart.",
      });
    }
    updateProduct = {
      productId: productId,
      price: product.price,
      image: product.image,
      name: product.name,
      quantity: productQuantity,
    };

    const indx = cartProducts.findIndex(
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
    const orderProducts = order.products.map((product) => {
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
        products: orderProducts,
      }
    );

    if (bankResSupplier.status !== 201) {
      // return next(
      //   createHttpError(500, "Transaction failed while paying supplier")
      // );
      console.log("Transaction failed while paying supplier");
    }

    const supplierOrder = new SupplierOrderEcom({
      userOrderId: order._id,
      products: orderProducts,
      totalPaid: bankResSupplier.data.totalAmount,
      transactionId: bankResSupplier.data.transactionId,
    });

    const products = await Products.find();

    for (let i = 0; i < products.length; i++) {
      const orderProduct = orderProducts.filter(
        (orderProduct) => orderProduct.productId == products[i].id
      )[0];
      let newQty = products[i].quantity;
      if (orderProduct) newQty -= orderProduct.quantity;
      products[i].quantity = newQty;
      await products[i].save();
    }

    await supplierOrder.save();

    const supplierResponse = await axios.put(
      process.env.SUPPLIERAPIENDPOINT + "/order",
      {
        transactionId: supplierOrder.transactionId,
      }
    );

    if (supplierResponse.status !== 201) {
      // next(createHttpError(500, "Failed placing order at supplier"));
      console.log("Failed placing order at supplier");
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
  const products = await Products.find();
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

exports.getTransactionChain = async (req, res, next) => {
  const userTransactionId = req.query.transactionId;
  // console.log(userTransactionId);
  try {
    const userOrder = await Order.findOne({
      transactionId: mongoose.Types.ObjectId(userTransactionId),
    });
    if (!userOrder) {
      const error = new Error(
        "User order not found associated with given transactionId"
      );
      throw error;
    }

    const supplierOrderFromEcom = await SupplierOrderEcom.findOne({
      userOrderId: mongoose.Types.ObjectId(userOrder._id),
    });
    const transactionToSupplier = await Transaction.findById(
      supplierOrderFromEcom.transactionId
    );
    const transactionToUser = await Transaction.findById(
      userOrder.transactionId
    );

    const bankUser = await BankUser.findById(transactionToUser.from);
    const bankEcom = await BankUser.findById(transactionToUser.to);
    const bankSupplier = await BankUser.findById(transactionToSupplier.to);

    res.status(200).json({
      message: "transaction histroy fetched",
      userOrderTransaction: transactionToUser._doc,
      ecomOrderToSupplierTransaction: transactionToSupplier._doc,
      bankUser: bankUser._doc,
      bankEcom: bankEcom._doc,
      bankSupplier: bankSupplier._doc,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
