const express = require("express");
const router = express.Router();
const authController = require("../../controllers/ecom/auth");

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *       properties:
 *         userId: 
 *          type: string
 *          description: Auto generated id
 *         username:
 *           type: string
 *           description: username
 *         firstName: 
 *          type: string
 *          description: first name
 *         lastName: 
 *          type: string
 *          description : last name
 *         token: 
 *          type: string
 *          description: generated token
 *         email:
 *            type: string
 *            description: password
 *         timeOut: 
 *          type: string
 *          description: time out
 *         password:
 *           type: string
 *           description: password
 *       example:
 *         username: lullabyXR
 *         email: hassan_rabbi@live.com
 *         password: qwerty12345
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Customers
 */

/**
 * @swagger
 * /ecom/api/auth/signup:
 *   put:
 *     summary: User sign updated
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User logged it
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Some server error
 */

// PUT -> /ecom/api/auth/signup
router.put("/signup", authController.signup);

/**
 * @swagger
 * /ecom/api/auth/verification:
 *   get:
 *     summary: Returns the list of all the books
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Token verification
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               items:
 *                 $ref: '#/components/schemas/User'
 */

// GET -> /ecom/api/auth/verification
router.get("/verification/:token", authController.getVerfication);
/**
 * @swagger
 * /ecom/api/auth/login:
 *   post:
 *     summary: Verification token
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Varified
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Some server error
 */
// POST -> /ecom/api/auth/login
router.post("/login", authController.postlogin);
/**
 * @swagger
 * /ecom/api/auth/refreshToken:
 *   get:
 *     summary: Returns token
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Token
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
// GET -> /ecom/api/auth/refreshToken
router.get("/refreshToken", authController.refreshToken);

module.exports = router;
