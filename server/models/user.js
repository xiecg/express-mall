
const mongoose = require('mongoose');
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
    productNum: Number,
  }],
  addressList: Array
});

module.exports = mongoose.model('User', userSchema);