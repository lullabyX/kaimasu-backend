const { Router } = require("express");
const { postBankInfo } = require("../../controllers/ecom/bank-details");
const isAuth = require("../../middlewares/auth/isAuth");

const router = Router();

router.post("/", isAuth, postBankInfo);

module.exports = router;
