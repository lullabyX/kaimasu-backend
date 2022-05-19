const { Router } = require("express");
const {
  postCart,
  getCart,
  checkout,
  confirmDeliver,
} = require("../../controllers/ecom/shop");
const isAuth = require("../../middlewares/auth/isAuth");

const router = Router();

// POST -> /ecom/api/shop/update-cart
router.post("/update-cart", isAuth, postCart);
// GET -> /ecom/api/shop/cart
router.get("/cart", isAuth, getCart);
// PUT -> /ecom/api/shop/checkout
router.put("/checkout", isAuth, checkout);
// POST -> /ecom/api/shop/order
router.post("/order", confirmDeliver);

module.exports = router;
