const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ObjectId = Schema.Types.ObjectId

const BookShelfSchema = new Schema({
  user: {
    type: ObjectId,
    ref: 'User',
    require: true //不可为空约束
  },
  novel: {
    type: ObjectId,
    ref: 'Novel',
    unique: true,//不可重复约束
    require: true //不可为空约束
  },
  // chapter: { type: ObjectId, ref: 'chapter'},
  progress: {
    type: String,
    default: '0'
  },
  is_true: {
    type: Boolean,
    default: true,
  },
})

module.exports = mongoose.model('Bookshelf', BookShelfSchema);
