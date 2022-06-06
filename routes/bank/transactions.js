const { Router } = require("express");
const {
  putTransaction,
  getTransaction,
} = require("../../controllers/bank/transaction");

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Transaction:
 *       type: object
 *       required:
 *         - fromInfo
 *         - toInfo
 *         - products
 *       properties:
 *         fromInfo:
 *          type: string
 *          description: from bank Account
 *         toInfo:
 *          type: string
 *          description: to bank Account
 *         products:
 *           type: array
 *           description: products list
 *       example:
 *         fromInfo: 0123456789,
 *         toInfo: 135466986,
 *         bankAccountToken: null
 */

/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: Bank account holder
 */

/**
 * @swagger
 * /bank/api/user/update-user:
 *   put:
 *     summary: Add bank details
 *     tags: [Transactions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Transaction'
 *     responses:
 *       200:
 *         description: Varified
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transaction'
 *       500:
 *         description: Some server error
 */

// PUT -> /bank/api/transaction
router.put("/", putTransaction);

/**
 * @swagger
 * /bank/api/transaction:
 *   get:
 *     summary: Returns the list of all the books
 *     tags: [Transactions]
 *     responses:
 *       200:
 *         description: Transaction details
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               items:
 *                 $ref: '#/components/schemas/Transaction'
 */
// GET -> /bank/api/transaction
router.get("/:transactionId", getTransaction);

module.exports = router;
