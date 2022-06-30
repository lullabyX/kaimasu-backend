const express = require("express");
const dotenv = require("dotenv");
const dbClient = require("./middlewares/common/database");
const cookieParser = require("cookie-parser");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const cors = require("cors");

const app = express();
dotenv.config();
app.use(cors());

// ECOM
const ecomAuthRoutes = require("./routes/ecom/auth");
const ecomBankRoutes = require("./routes/ecom/bank-details");
const ecomShopRoutes = require("./routes/ecom/shop");

// BANK
const bankUserRoutes = require("./routes/bank/bankUser");
const bankTransactionRoutes = require("./routes/bank/transactions");

// SUPPLIER
const supplierOrderRoutes = require("./routes/supplier/order");

// SWAGGER
const swaggerOptions = require("./middlewares/common/swagger")
const specs = swaggerJsDoc(swaggerOptions);
app.use("/docs", swaggerUI.serve, swaggerUI.setup(specs));


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
app.use("/ecom/api/shop", ecomShopRoutes);

// BANK ROUTES
app.use("/bank/api/user", bankUserRoutes);
app.use("/bank/api/transaction", bankTransactionRoutes);

// SUPPLIER ROUTES
app.use("/supplier/api/order", supplierOrderRoutes);

// Error Handleing
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`app listening at port:${process.env.PORT}`);
});
