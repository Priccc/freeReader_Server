const http = require('http');
const cheerio = require('cheerio');
const Request = require('request');
const iconv = require('iconv-lite');
const Chapter = require('../models/Chapter');

const request = (url) => {
  return new Promise(function(resolve, reject) {
    http.get(url, function(res) {
      let body = ''

      res.on('data', function(data) {
        body += data
      })
      res.on('end', function() {
        resolve(body)
      })
    }).on('error', function(e) {
      reject(e)
    })
  })
};

const getChapterContent = (url) => {
  return new Promise(function(resolve, reject) {
    Request({url: url, encoding: null}, function (err, res, body) {
      if (!err) {
        const html = iconv.decode(body, 'gb2312')
        const $ = cheerio.load(html, {decodeEntities: false})
        const content = $('#content').text()
        resolve(content)
      }
      else {
        reject(err)
      }
    })
  })
};

const getNovel = async ($, id) => {
  const list = $('#list a')

  for (let i = 0, len = list.length; i < len; i++ ) {
    const title = list[i].children[0].data
    const href = list[i].attribs.href
    const num = href.substring(0,href.length - 5)

    const chapter = new Chapter({
      title: title,
      postfix: href,
      number: i,
      novel: id,
    })

    await chapter.save()
  }
}

const getHtml = (url) => {
  return new Promise(function(resolve, reject) {
    Request({url: url, encoding: null}, function (err, res, body) {
     if (!err) {
       const html = iconv.decode(body, 'gb2312')
       const $ = cheerio.load(html, {decodeEntities: false})
       resolve($)
     }
     else {
       console.log(err);
       reject(err)
     }
   })
  })
}

module.exports = {
  request,
  getChapterContent,
  getNovel,
  getHtml,
}
