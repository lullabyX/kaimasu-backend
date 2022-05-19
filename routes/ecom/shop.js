const { Router } = require("express");
const { postCart, getCart } = require("../../controllers/ecom/shop");
const isAuth = require("../../middlewares/auth/isAuth");

const router = Router();

// POST -> /ecom/api/shop/update-cart
router.post("/update-cart", isAuth, postCart);
// GET -> /ecom/api/shop/cart
router.get("/cart", isAuth, getCart);

module.exports = router;
