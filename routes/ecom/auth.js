const express = require("express");
const router = express.Router();
const authController = require("../../controllers/ecom/auth");

// PUT -> /ecom/api/auth/signup
router.put("/signup", authController.signup);
// GET -> /ecom/api/auth/verification
router.get("/verification/:token", authController.getVerfication);

module.exports = router;
