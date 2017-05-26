const express = require('express');
const router = express.Router();
const cheerio = require('cheerio');
const Crawler = require('../utils/Crawler');
const Novel = require('../models/Novel');
const User = require('../models/User');
const ReadingList = require('../models/ReadingList');

const getSearchList = async (req, res, next) => {  // 获取搜索列表
  const { name } = req.query;
  //笔趣库搜索网站
  const url = `http://zhannei.baidu.com/cse/search?s=2041213923836881982&q=${name}`
  try {
    var body = await Crawler.request(encodeURI(url))
  } catch (e) {

  }
  const $ = cheerio.load(body, {decodeEntities: false})

  const length = $('.result-game-item-detail').length

  //爬取小说信息，用于展示
  let arr = []
  for (let i = 0; i < length; i++) {
    const title = $('.result-game-item-detail a')[i].attribs.title
    const img = $('.result-game-item-pic img')[i].attribs.src
    const url = $('.result-game-item-detail a')[i].attribs.href
    const introduction = $('.result-game-item-desc').eq(i).text().replace(/\s/g, "")
    const author = $('.result-game-item-info span').eq(i * 6 + 1).text().replace(/\s/g, "")
    const type = $('.result-game-item-info span').eq(i * 6 + 3).text()
    let json = {
      title: title,
      img: img,
      url: url,
      introduction: introduction,
      author: author,
      type: type
    }
    arr.push(json)
  }
  res.jsonp({
    status: 200,
    data: arr
  });
}

const joinBookshelf = async (req, res, next) => {  // 将图书添加到书架
  const { uid, name, author, type, introduction, image_url, url } = req.query;
  let nn = await Novel.findOne({ name, is_true: true });
  if (!nn) {
    const novel = new Novel({
      name,
      author,
      type,
      introduction,
      image_url,
      url,
      update_time: new Date(),
    });
    await novel.save(err => {
      if (err) {
        return res.send({
          status: 500,
          msg: 'Failure to acquire novel information!'
        });
      }
    });
    nn = await Novel.findOne({ name, is_true: true });
  }
  const reading = new ReadingList({});
  const rr = await reading.save();
  const uu = await User.findOneAndUpdate(
    { _id: uid },
    {
      $addToSet: {
        novels: {
          novel: nn._id,
          reading: rr._id,
        }
      }
    }
  );
  if (uu) {
    return res.jsonp({
      status: 200,
      msg: 'join bookshelf success!'
    });
  }
  res.jsonp({
    status: 500,
    msg: 'join bookshelf faile!'
  });
};

const getBookshelfList = async (req, res, next) => {  // 拉取书架图书列表
  const { uid } = req.query;
  const nn = await User.findOne({ _id: uid, is_true: true })
    .populate([
      {
        path: 'novels.novel',
        select: '_id name author image_url update_time',
      },
      {
        path: 'novels.reading',
        select: 'progress',
      }
    ])
    .exec();
  if (nn) {
    return res.jsonp({
      status: 200,
      data: nn.novels.map(item => ({
        id: item.novel._id,
        name: item.novel.name,
        author: item.novel.author,
        image_url: item.novel.image_url,
        update_time: item.novel.update_time,
        progress: item.reading.progress,
      }))
    });
  }
  res.jsonp({
    status: 500,
    msg: 'Failure to acquire novel information!',
  });
};

module.exports = {
  getSearchList,
  joinBookshelf,
  getBookshelfList,

  init(router) {
    router.get('/novel/search', getSearchList);
    router.get('/novel/joinbookshelf', joinBookshelf);
    router.get('/novel/list', getBookshelfList);
  },
};
