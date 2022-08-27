const { Router } = require("express");
const {
  postCart,
  getCart,
  checkout,
  confirmDeliver,
  getProducts,
  getTransactionChain,
} = require("../../controllers/ecom/shop");
const isAuth = require("../../middlewares/auth/isAuth");

const router = Router();
/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - productId
 *         - productName
 *         - productPrice
 *         - productImage
 *         - productQuantity
 *       properties:
 *         productId:
 *          type: string
 *          description: product Id
 *         productName:
 *           type: string
 *           description: product Name
 *         productPrice:
 *          type: number
 *          description: product Price
 *         productImage:
 *          type: string
 *          description: product Image
 *         productQuantity:
 *          type: number
 *          description: product Quantity
 *       example:
 *         productId : 1-id
 *         productName : Water Bottle
 *         productPrice : 500
 *         productImage : null
 *         productQuantity : 1
 */

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Products
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Address:
 *       type: object
 *       required:
 *         - FullName
 *         - Region
 *         - City
 *         - Area
 *         - Address
 *         - PhoneNumber
 *       properties:
 *         FullName:
 *          type: string
 *          description: Customer FullName
 *         Region:
 *           type: string
 *           description: Region
 *         City:
 *          type: string
 *          description: City
 *         Area:
 *          type: string
 *          description: Area
 *         Address:
 *          type: String
 *          description: Address
 *         PhoneNumber:
 *          type: string
 *          description: PhoneNumber
 *       example:
 *         FullName : Mahmudul Hassan Rabbi
 *         Region : Bangladesh
 *         City : Sylhet
 *         Area : Akhaliya
 *         Address : 4/B Madani Comples, SUST gate
 *         PhoneNumber": 01234567899
 */

/**
 * @swagger
 * tags:
 *   name: Checkout
 *   description: Checkout
 */

/**
 * @swagger
 * /ecom/api/shop/update-cart:
 *   post:
 *     summary: Add product to cart
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Varified
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       500:
 *         description: Some server error
 */
// POST -> /ecom/api/shop/update-cart
router.post("/update-cart", isAuth, postCart);

/**
 * @swagger
 * /ecom/api/shop/cart:
 *   get:
 *     summary: Returns the list of all the books
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Token verification
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
// GET -> /ecom/api/shop/cart
router.get("/cart", isAuth, getCart);

/**
 * @swagger
 * /ecom/api/shop/checkout:
 *   put:
 *     summary: User checkout
 *     tags: [Checkout]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Address'
 *     responses:
 *       200:
 *         description: User checked out
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Address'
 *       500:
 *         description: Some server error
 */
// PUT -> /ecom/api/shop/checkout
router.put("/checkout", isAuth, checkout);

/**
 * @swagger
 * /ecom/api/shop/order:
 *   post:
 *     summary: Add product to cart
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Varified
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       500:
 *         description: Some server error
 */
// POST -> /ecom/api/shop/order
router.post("/order", confirmDeliver);
//GET -> /ecom/api/shop/products
// router.get("/products", getProducts);

/**
 * @swagger
 * /ecom/api/shop/products:
 *   get:
 *     summary: Returns the list of all the books
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Get Products
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
// GET -> /ecom/api/shop/products
router.get("/products", getProducts);

// GET -> /ecom/api/shop/transaction-chain?transactionId=6308a2c579e6728632c512bc
router.get("/transaction-chain", isAuth, getTransactionChain);

module.exports = router;
