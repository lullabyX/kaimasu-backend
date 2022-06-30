const { Router } = require("express");
const { putOrder } = require("../../controllers/supplier/order");

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       required:
 *         - transactionId
 *       properties:
 *         transactionId:
 *          type: string
 *          description: Auto generated id
 *       example:
 *         transactionId: lullaby31321XR
 */

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Customers' order
 */

/**
 * @swagger
 * /supplier/api/order:
 *   put:
 *     summary: User checkout
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       200:
 *         description: User checked out
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       500:
 *         description: Some server error
 */
// PUT -> /supplier/api/order
router.put("/", putOrder);

module.exports = router;
