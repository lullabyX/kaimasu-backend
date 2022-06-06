const { Router } = require("express");
const { postBankInfo } = require("../../controllers/ecom/bank-details");
const isAuth = require("../../middlewares/auth/isAuth");

const router = Router();
/**
 * @swagger
 * components:
 *   schemas:
 *     BankAccount:
 *       type: object
 *       required:
 *         - bankAccountNo
 *         - bankAccountName
 *         - bankAccountToken 
 *       properties:
 *         bankAccountNo: 
 *          type: string
 *          description: bank Account Number
 *         bankAccountName:
 *           type: string
 *           description: Account holder Name
 *         bankAccountToken: 
 *          type: string
 *          description: bank password
 *       example:
 *         bankAccountNo: 0123456789,
 *         bankAccountName: lullaby,
 *         bankAccountToken: qwerty
 */

/**
 * @swagger
 * tags:
 *   name: BankAccounts
 *   description: Customers
 */

/**
 * @swagger
 * /ecom/api/bank-details:
 *   post:
 *     summary: Add bank details
 *     tags: [BankAccounts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BankAccount'
 *     responses:
 *       200:
 *         description: Varified
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BankAccount'
 *       500:
 *         description: Some server error
 */
router.post("/", isAuth, postBankInfo);

module.exports = router;
