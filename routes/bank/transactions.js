const { Router } = require("express");
const {
  putTransaction,
  getTransaction,
} = require("../../controllers/bank/transaction");

const router = Router();

// PUT -> /bank/api/transaction
router.put("/", putTransaction);
// GET -> /bank/api/transaction
router.get("/:transactionId", getTransaction);

module.exports = router;
