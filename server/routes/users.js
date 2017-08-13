
require('./../util/util');

const express = require('express');
const router = express.Router();
const User = require('../models/user');

/* 登录 */
router.post('/login', (req, res, next) => {
  const body = req.body;
  const param = {
    userName: body.userName,
    userPwd: body.userPwd,
  };
  User.findOne(param, (err, doc) => {
    if (err) {
      res.json({ status: 1, msg: res.messgae });
    } else {
      if (doc) {
        res.cookie('userId', doc.userId, { path: '/', maxAge: 1000 * 60 * 60 });
        res.cookie('userName', doc.userName, { path: '/', maxAge: 1000 * 60 * 60 });
        // req.session.user = doc;
        res.json({ status: 0, msg: '', result: { userName: doc.userName } });
      } else {
        res.json({ status: 1, msg: '用户名或密码错误' });
      }
    }
  });
});

/* 登出 */
router.post('/logout', (req, res, next) => {
  res.cookie('userId', '', { path: '/', maxAge: -1 });
  res.cookie('userName', '', { path: '/', maxAge: -1 });
  res.json({ status: 0, msg: '', result: '' });
});

/* 校验是否登录 */
router.get('/checkLogin', (req, res, next) => {
  if (req.cookies.userId) {
    res.json({ status: 0, msg: '', result: req.cookies.userName });
  } else {
    res.json({ status: 1, msg: '未登录', result: '' });
  }
});

/* 获取购物车列表 */
router.get('/cartList', (req, res, next) => {
  const userId = req.cookies.userId;
  User.findOne({userId}, (err, doc) => {
    if (err) {
      res.json({ status: 1, msg: res.messgae });
    } else {
      res.json({ status: 0, msg: '', result: doc.cartList });
    }
  });
});

/* 购物车删除 */
router.post('/cartDel', (req, res, next) => {
  const body = req.body;
  const userId = req.cookies.userId;
  const productId = body.productId;
  User.update({ userId }, { $pull: {
    cartList: { productId }
  } }, (err, doc) => {
    if (err) {
      res.json({ status: 1, msg: res.messgae });
    } else {
      res.json({ status: 0, msg: '', result: 'success' });
    }
  });
});

/* 购物车编辑 */
router.post('/cartEdit', (req, res, next) => {
  const userId = req.cookies.userId;
  const body = req.body;
  const productId = body.productId;
  const productNum = body.productNum;
  const checked = body.checked;
  User.update({
    userId,
    'cartList.productId': productId
  }, {
    'cartList.$.productNum': productNum,
    'cartList.$.checked': checked
  }, (err, doc) => {
    if (err) {
      res.json({ status: 1, msg: res.messgae });
    } else {
      res.json({ status: 0, msg: '', result: 'success' });
    }
  });
});

/* 购物车全选 */
router.post('/cartEditCheckAll', (req, res, next) => {
  const userId = req.cookies.userId;
  const body = req.body;
  const checkAll = body.checkAll;
  User.findOne({
    userId
  }, (err, user) => {
    if (err) {
      res.json({ status: 1, msg: res.messgae });
    } else {
      user.cartList.forEach(item => {
        item.checked = checkAll;
      });
      user.save((err, doc) => {
        if (err) {
          res.json({ status: 1, msg: res.messgae });
        } else {
          res.json({ status: 0, msg: '', result: 'success' });
        }
      });
    }
  });
});

/* 获取地址 */
router.get('/addressList', (req, res, next) => {
  const userId = req.cookies.userId;
  User.findOne({userId}, (err, doc) => {
    if (err) {
      res.json({ status: 1, msg: res.messgae });
    } else {
      res.json({ status: 0, msg: '', result: doc.addressList });
    }
  });
});

/* 设置默认地址 */
router.post('/setDefault', (req, res, next) => {
  const userId = req.cookies.userId;
  const body = req.body;
  const addressId = body.addressId;
  User.findOne({userId}, (err, doc) => {
    if (err) {
      res.json({ status: 1, msg: res.messgae });
    } else {
      const addressList = doc.addressList;
      addressList.forEach(item => {
        if (item.addressId == addressId) {
          item.isDefault = true;
        } else {
          item.isDefault = false;
        }
      });
      doc.save((err, doc) => {
        if (err) {
          res.json({ status: 1, msg: res.messgae });
        } else {
          res.json({ status: 0, msg: '', result: 'success' });
        }
      });
    }
  });
});

/* 删除地址 */
router.post('/delAddress', (req, res, next) => {
  const userId = req.cookies.userId;
  const body = req.body;
  const addressId = body.addressId;
  User.update({ userId }, { $pull: {
    addressList: { addressId }
  } }, (err, doc) => {
    if (err) {
      res.json({ status: 1, msg: res.messgae });
    } else {
      res.json({ status: 0, msg: '', result: 'success' });
    }
  });
});

/* 生成订单 */
router.post('/payMent', (req, res, next) => {
  const userId = req.cookies.userId;
  const body = req.body;
  const addressId = body.addressId;
  const orderTotal = body.orderTotal;

  User.findOne({userId}, (err, doc) => {
    if (err) {
      res.json({ status: 1, msg: res.messgae });
    } else {

      // 获取地址
      let address = '';
      doc.addressList.forEach(item => {
        if (item.addressId == addressId) {
          address = item;
        }
      });

      // 获取用户购物车购买的商品
      let goodsList = [];
      doc.cartList.filter(item => {
        if (item.checked) {
          goodsList.push(item);
        }
      });

      let platform = '622';
      let r1 = Math.floor( Math.random() * 10 );
      let r2 = Math.floor( Math.random() * 10 );
      let sysDate = new Date().Format('yyyyMMddhhmmss');
      let createDate = new Date().Format('yyyy-MM-dd hh:mm:ss');
      let orderId = platform + r1 + sysDate + r2;

      let order = {
        orderId: orderId,
        orderTotal: orderTotal,
        addressInfo: address,
        goodsList: goodsList,
        orderStatus: 1,
        createDate: createDate
      }

      doc.orderList.push(order);
      doc.save((err, doc) => {
        if (err) {
          res.json({ status: 1, msg: res.messgae });
        } else {
          res.json({ status: 0, msg: '', result: { orderId: order.orderId, orderTotal: order.orderTotal } });
        }
      });
    }
  });
});

/* 订单详细 */
router.get('/orderDetail', (req, res, next) => {
  const userId = req.cookies.userId;
  const orderId = req.param('orderId');
  User.findOne({userId}, (err, doc) => {
    if (err) {
      res.json({ status: 1, msg: res.messgae });
    } else {
      let orderList = doc.orderList;
      let orderTotal = 0; 
      orderList.forEach(item => {
        if (item.orderId == orderId) {
          orderTotal = item.orderTotal;
        }
      });
      if (orderTotal) {
        res.json({ status: 0, msg: '', result: { orderId, orderTotal } });
      } else {
        res.json({ status: 1, msg: '未查询到此订单' });
      }
    }
  })
});

module.exports = router;
