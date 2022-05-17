const express = require("express");
const dotenv = require("dotenv");
const dbClient = require("./middlewares/common/database");
const app = express();
dotenv.config();

const authRoutes = require("./routes/ecom/auth");

dbClient;

// Request Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ECOMMERCE ROUTES
app.use("/ecom/api/auth", authRoutes);

app.listen(process.env.PORT, () => {
  console.log(`app listening at port:${process.env.PORT}`);
});
