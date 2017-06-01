/**
 * 对外的API路由
 */

const _ = require('lodash');
const express = require('express');
const routes = [
  require('../controllers/Novel'),
  require('../controllers/User'),
  require('../controllers/Chapter'),
];

// Setup Route Bindings
module.exports = function (app) {
  app.get('/', (req, res) => {
    res.send('hello API !');
  });

  const router = express.Router();
  _.map(routes, (controller) => {
    controller.init(router);
  });

  app.use('/api', router);
};
