
const mongoose = require('mongoose');
const mongoClient = require('./index');
const Schema = mongoose.Schema;

const produtSchema = new Schema({
  productId: String,
  productName: String,
  salePrice: Number,
  productImage: String,
  checked: Boolean,
  productNum: Number,
});

module.exports = mongoClient.model('Good', produtSchema, 'goods');
