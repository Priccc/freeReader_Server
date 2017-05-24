const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NovelSchema = new Schema({
  name: { type: String },
  image_url: { type: String },
  url: { type: String },
  introduction: { String },
  author: { type: String },
  type: { type: String },
});

module.exports = mongoose.model('Novel', NovelSchema);
