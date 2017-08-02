
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const produtSchema = new Schema({
  productId: String,
  productName: String,
  salePrice: Number,
  productImage: String
});

module.exports = mongoose.model('Good', produtSchema);