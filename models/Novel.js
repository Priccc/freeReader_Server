const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NovelSchema = new Schema({
  name: {
    type: String,
    unique: true,//不可重复约束
    require: true //不可为空约束
  },
  image_url: { type: String },
  url: { type: String },
  introduction: { type: String },
  author: { type: String },
  type: { type: String },
  chapter: [{
    type: Schema.Types.ObjectId,
    ref: 'Chapter',
  }],
  update_time: { type: Date },
  is_true: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model('Novel', NovelSchema);
