const { Router } = require("express");
const { postUserDetail } = require("../../controllers/bank/BankUser");

const router = Router();

// POST -> /bank/api/user/update-user
router.post("/update-user", postUserDetail);

module.exports = router;
