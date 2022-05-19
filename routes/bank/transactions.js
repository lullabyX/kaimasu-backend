const { Router } = require("express");
const { putTransaction } = require("../../controllers/bank/Transaction");

const router = Router();

// PUT -> /bank/api/transaction
router.put("/", putTransaction);

module.exports = router;
