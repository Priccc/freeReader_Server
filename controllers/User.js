const express = require('express');
const router = express.Router();
const tools = require('../utils/tools');
const User = require('../models/User');

// 用户注册
const register = (req, res, next) => {
  const { username, password, email, phone } = req.query;
  const user = new User({
    name: username,
    password: tools.getSha1(password),
    email: email,
    phone: phone,
    last_visit_time: new Date(),
  });

  user.save(err => {
    if (err) {
      return res.send({
        status: 500,
        msg: 'register faile!'
      });
    }
    res.send({
      status: 200,
      msg: 'success register!'
    });
  });
};

// 用户登录
const login = async (req, res, next) => {
  const { username, password } = req.body;
  await User.findOne({
    name: username,
    password: tools.getSha1(password),
    is_true: true,
  }, (err, uu) => {
    if (err && !uu) {
      return res.json({
        status: 500,
        msg: 'login faile!'
      });
    }
    res.send({
      status: 200,
      msg: 'login success!',
      data: uu,
    })
  });
};

module.exports = {
  register,
  login,

  init(router) {
    router.post('/register', register);
    router.post('/login', login);
  },
};
