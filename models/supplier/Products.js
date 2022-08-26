const mongoose = require("mongoose");

const productsSchema = mongoose.Schema({
  id: { type: String },
  name: { type: String },
  image: { type: String },
  quantity: { type: Number },
  price: { type: Number },
});

const Products = mongoose.model("Products", productsSchema);

module.exports = Products;
