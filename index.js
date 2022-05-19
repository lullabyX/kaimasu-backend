const express = require("express");
const dotenv = require("dotenv");
const dbClient = require("./middlewares/common/database");
const cookieParser = require("cookie-parser");

const app = express();
dotenv.config();

// ECOM
const ecomAuthRoutes = require("./routes/ecom/auth");
const ecomBankRoutes = require("./routes/ecom/bank-details");

// BANK
const bankUserRoutes = require("./routes/bank/BankUser");

const {
  notFoundHandler,
  errorHandler,
} = require("./middlewares/common/errorHandler");

dbClient;

// Request Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie Parser
app.use(cookieParser(process.env.COOKIE_SECRET));

// ECOMMERCE ROUTES
app.use("/ecom/api/auth", ecomAuthRoutes);
app.use("/ecom/api/bank-details", ecomBankRoutes);

// BANK ROUTES
app.use("/bank/api/user", bankUserRoutes);

// Error Handleing
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`app listening at port:${process.env.PORT}`);
});
