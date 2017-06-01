const express = require('express');
const router = express.Router();
const cheerio = require('cheerio');
const Crawler = require('../utils/Crawler');
const Novel = require('../models/Novel');
const User = require('../models/User');
const ReadingList = require('../models/ReadingList');
const Chapter = require('../models/Chapter');

const getChapterContent = async (req, res, next) => {
  const { nid, num } = req.query;
  let detail,novel
  try {
    detail = await Chapter.findByNumber(nid, num);
    novel = await Novel.findOne({ _id: detail.novel });
  } catch (e) {

  }

  //如果没有内容，会去网站爬取
  if (!detail.content) {
    const url = `${novel.url}${detail.postfix}`
    try {
      const content = await Crawler.getChapterContent(url)
      detail.content = content
      await detail.save()
    } catch (e) {

    }
  }
  res.jsonp({
    status: 200,
    data: detail,
  });
};

module.exports = {
  getChapterContent,

  init(router) {
    router.get('/chapter', getChapterContent);
  },
};
