const express = require('express');
const router = express.Router();
const cheerio = require('cheerio');
const Crawler = require('../utils/Crawler');
const Novel = require('../models/Novel');

const getList = async (req, res, next) => {  // 获取搜索列表
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

  tasks = arr.map(item => new Promise((resolve) => {
    const data = {
      name: item.title,
      image_url: item.img,
      url: item.url,
      introduction: item.introduction,
      author: item.author,
      type: item.type,
    };
    try {
      const instance = new Novel(data);  // eslint-disable-line
      instance.save((err, item) => {
        (err ? console.error : console.log)(`insert labels ${err ? 'failed' : 'success'}`, JSON.stringify({ item, err }));

        resolve(instance);
      });
    } catch (e) {
      console.error('An unknown error occurred when the template was created:', { e, data });
      resolve();
    }
  }));

  Promise.all(tasks).then(() => {
    console.log('novel sync completed');
    res.jsonp({
      status: 200,
      data: arr
    });
    done();
  }).catch(e => {
    console.error('novel', e);
    done();
  });
}
module.exports = {
  getList,

  init(router) {
    router.get('/novel/search', getList);
  },
};
