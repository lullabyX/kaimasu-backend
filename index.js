const express = require("express");
const dotenv = require("dotenv");

const app = express();
dotenv.config();

app.listen(process.env.PORT, () => {
  console.log(`app listening at port:${process.env.PORT}`);
});
