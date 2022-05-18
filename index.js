const express = require("express");
const dotenv = require("dotenv");
const dbClient = require("./middlewares/common/database");
const cookieParser = require("cookie-parser");

const app = express();
dotenv.config();

const authRoutes = require("./routes/ecom/auth");

dbClient;

// Request Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie Parser
app.use(cookieParser(process.env.COOKIE_SECRET));

// ECOMMERCE ROUTES
app.use("/ecom/api/auth", authRoutes);

// Error Handleing
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`app listening at port:${process.env.PORT}`);
});
