
const mongoose = require('mongoose');
const mongoClient = require('./index');
const Schema = mongoose.Schema;

const userSchema = Schema({
  userId: String,
  userName: String,
  userPwd: String,
  orderList: Array,
  cartList: [{
    productId: String,
    productName: String,
    salePrice: String,
    productImage: String,
    checked: Boolean,
    productNum: Number
  }],
  addressList: [{
    addressId: String,
    userName: String,
    streetName: String,
    postCode: String,
    tel: Number,
    isDefault: Boolean
  }]
});

module.exports = mongoClient.model('User', userSchema, 'users');
