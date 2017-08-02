
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Goods = require('../models/goods');

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

router.get('/', function(req, res, next) {
  Goods.find({}, (err, doc) => {
    if (err) {
      res.json({ status: 1, msg: res.messgae });
    } else {
      res.json({ status: 0, msg: '', result: { count: doc.length, list: doc } });
    }
  });
  // res.send('hello, goods');
  // res.render('index', { title: 'Express,Very Goood' });
});

module.exports = router;