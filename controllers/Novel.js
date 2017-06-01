const express = require('express');
const router = express.Router();
const cheerio = require('cheerio');
const Crawler = require('../utils/Crawler');
const Novel = require('../models/Novel');
const User = require('../models/User');
const Chapter = require('../models/Chapter');
const BookShelf = require('../models/BookShelf');

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
      name: title,
      image_url: img,
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
  const { uid } = req.query;
  const { name, author, type, introduction, image_url, url } = req.body;
  await Novel.remove({ is_true: false });
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
      is_true: false,
    });
    await novel.save(err => {
      if (err) {
        return res.send({
          status: 500,
          msg: 'Failure to acquire novel information!'
        });
      }
    });

    try {
      var $ = await Crawler.getHtml(url)
    } catch (e) {
      return res.jsonp({
        data: 500,
        msg: e,
      });
    }

    const novelId = novel._id

    await Crawler.getNovel($, novelId)

    nn = await Novel.findOne({ name });

    try {
      var lastChapter = await Chapter.getLastTitle(novelId)
      var count = await Chapter.getCount(novelId)
    } catch (e) {
      return res.jsonp({
        data: 500,
        msg: e,
      });
    }

    nn.lastChapterTitle = lastChapter[0].title;
    nn.countChapter = count;
    nn.is_true = true;

    try {
      await nn.save()
    } catch (e) {
      return res.jsonp({
        data: 500,
        msg: e,
      });
    }
  }
  const bksf = new BookShelf({
    user: uid,
    novel: nn._id,
  });

  const bb = await bksf.save();
  if (bb) {
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

  const bb = await BookShelf.find({ user: uid })
   .populate({
       path: 'novel'
     })
   .exec();
  if (bb) {
    return res.jsonp({
      status: 200,
      data: bb.map(item => ({
        id: item.novel._id,
        name: item.novel.name,
        author: item.novel.author,
        image_url: item.novel.image_url,
        type: item.novel.type,
        update_time: item.novel.update_time,
        progress: item.progress,
      }))
    });
  }
  res.jsonp({
    status: 500,
    msg: 'Failure to acquire novel information!',
  });
};

const getNovelDirectory = async (req, res, next) => {
  const { nid } = req.query;
  let results = [];
  const options = {
    novel: nid,
    attributes: ['title', 'content', 'number'],
    order: 1
  }
  try {
    results = await Chapter.getDirectory(options)
  } catch (err) {

  }
  res.jsonp({
    status: 200,
    data: results,
  });
};

const progress = async (req, res, next) => {
  const { nid, num } = req.query;

  if (nid && !num) {
    const bb = await BookShelf.findOne({ novel: nid });
    res.jsonp({
      status: 200,
      data: bb,
    });
  } else if (num) {
    const bb = await BookShelf.findOneAndUpdate({ novel: nid }, { $set: { 'progress': num.toString() }});
    res.jsonp({
      status: 200,
      data: 'success',
    });
  }
};

module.exports = {
  getSearchList,
  joinBookshelf,
  getBookshelfList,
  getNovelDirectory,
  progress,

  init(router) {
    router.get('/novel/search', getSearchList);
    router.post('/novel/joinbookshelf', joinBookshelf);
    router.get('/novel/list', getBookshelfList);
    router.get('/novel/directory', getNovelDirectory);
    router.get('/novel/progress', progress);
  },
};
