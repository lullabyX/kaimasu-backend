const express = require("express");
const dotenv = require("dotenv");
const dbClient = require("./middlewares/common/database");
const app = express();
dotenv.config();

dbClient;

app.listen(process.env.PORT, () => {
  console.log(`app listening at port:${process.env.PORT}`);
});
