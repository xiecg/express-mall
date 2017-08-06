
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

module.exports = router;
