
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Goods = require('../models/goods');
const User = require('../models/user');

// 链接 MongoDB 数据库
mongoose.connect('mongodb://127.0.0.1:27017/expressmall');

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected success.');
});

mongoose.connection.on('error', () => {
  console.log('MongoDB connected fail.');
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB connected disconnected.');
});

const getPriceLevel = level => {
  const res = [[0, 100], [100, 500], [500, 1000], [1000, 5000]];
  if (level !== 'all') {
    let [ priceGt, priceLte ] = res[level];
    return { priceGt, priceLte }
  } else {
    return null;
  }
}

/* 查询商品列表 */
router.get('/list', (req, res, next) => {
  const page = Number(req.param('page'));
  const pageSize = Number(req.param('pageSize'));
  const priceLevel = getPriceLevel(req.param('priceLevel'));
  const sort = req.param('sort');
  const skip = (page - 1) * pageSize;
  const params = priceLevel ? {
    salePrice: { $gt: priceLevel.priceGt, $lte: priceLevel.priceLte }
  } : {};
  const goodsModel = Goods.find(params).skip(skip).limit(pageSize);
  goodsModel.sort({ salePrice: sort });
  goodsModel.exec((err, doc) => {
    if (err) {
      res.json({ status: 1, msg: res.messgae });
    } else {
      res.json({ status: 0, msg: '', result: { count: doc.length, list: doc } });
    }
  });
});

/* 加入购物车 */
router.post('/addCart', (req, res, next) => {
  const body = req.body;
  const userId = '100000077';
  const productId = body.productId;
  User.findOne({ userId }, (err, userDoc) => {
    if (err) {
      res.json({ status: 1, msg: res.messgae });
    } else {
      let goodsItem = '';
      userDoc.cartList.forEach(item => {
        if (item.productId == productId) {
          goodsItem = item;
          item.productNum ++;
        }
      });
      if (goodsItem) {
        userDoc.save((err, doc) => {
          if (err) {
            res.json({ status: 1, msg: res.messgae });
          } else {
            res.json({ status: 0, msg: '', result: 'success' });
          }
        });
        return;
      }
      Goods.findOne({
        productId
      }, (err, doc) => {
        if (err) {
          res.json({ status: 1, msg: res.messgae });
        } else {
          doc.productNum = 1;
          doc.checked = true;
          userDoc.cartList.push(doc);
          userDoc.save((err, doc) => {
            if (err) {
              res.json({ status: 1, msg: res.messgae });
            } else {
              res.json({ status: 0, msg: '', result: 'success' });
            }
          });
        }
      });
    }
  });
});

module.exports = router;