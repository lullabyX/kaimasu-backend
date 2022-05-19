const { Router } = require("express");
const { putOrder } = require("../../controllers/supplier/order");

const router = Router();

// PUT -> /supplier/api/order
router.put("/", putOrder);

module.exports = router;
