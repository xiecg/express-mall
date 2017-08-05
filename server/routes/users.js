
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

/* 校验 */
router.get('/checkLogin', (req, res, next) => {
  if (req.cookies.userId) {
    res.json({ status: 0, msg: '', result: req.cookies.userName });
  } else {
    res.json({ status: 1, msg: '未登录', result: '' });
  }
});

module.exports = router;
