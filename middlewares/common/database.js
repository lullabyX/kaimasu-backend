const mongoose = require("mongoose");
require("dotenv").config();

const dbClient = mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connected!");
  })
  .catch((error) => {
    console.log(error.message);
  });

exports.module = dbClient;
