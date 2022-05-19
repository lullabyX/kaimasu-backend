const createHttpError = require("http-errors");
const { default: mongoose } = require("mongoose");
const Cart = require("../../models/ecom/Cart");
const User = require("../../models/ecom/Users");
const Order = require("../../models/ecom/Order");

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
    cart.totalItems += +productQuantity;

    let product = products.filter(
      (product) => product.productId === productId
    )[0];
    if (product) {
      const oldQty = product.quantity;
      productQuantity = +productQuantity + oldQty;
    }
    product = {
      productId: productId,
      price: productPrice,
      image: productImage,
      name: productName,
      quantity: productQuantity,
    };

    const indx = products.findIndex(
      (product) => product.productId === productId
    );
    if (indx >= 0) {
      cart.products[indx] = product;
    } else {
      cart.products.push(product);
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

    //successfull api call to bank
    fullName = address.FullName || `${user.firstName} ${user.lastName}`;
    const order = new Order({
      userId: user._id,
      products: cart.products,
      totalItems: cart.totalItems,
      totalPaid: 0,
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
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
