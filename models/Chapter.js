const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChapterSchema = new Schema({
  title: {
    type: String,
    unique: true,//不可重复约束
    require: true //不可为空约束
  },
  content: { type: String },
  is_true: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model('Chapter', ChapterSchema);
