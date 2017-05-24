const http = require('http')
const cheerio = require('cheerio')

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
}

module.exports = {
  request,
}
