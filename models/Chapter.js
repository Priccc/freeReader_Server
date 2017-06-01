const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChapterSchema = new Schema({
  title: {
    type: String,
    unique: true,//不可重复约束
    require: true //不可为空约束
  },
  novel: {
    type: Schema.Types.ObjectId,
    ref: 'Novel',
  },
  number: { type: Number },
  postfix: { type: String },
  content: { type: String },
  novel_id: {
    type: Schema.Types.ObjectId,
    ref: 'Novel',
  },
    is_true: {
    type: Boolean,
    default: true,
  },
});

ChapterSchema.statics = {
  getFirstChapter: function (id){
    return this
      .findOne({novel: id},['_id'])
      .sort({number: 1})
      .limit(1)
      .exec()
  },
  getLastTitle: function (id){
    return this
      .find({novel: id}, ['title'])
      .sort({number: -1})
      .limit(1)
      .exec()
  },
  getCount: function (id){
    return this
      .find({novel: id})
      .count()
      .exec()
  },
  getContent: function (id){
    return this
      .findById(id)
      .populate('novel',['name', 'url'])
      .exec()
  },
  findByNumber: function (id, num) {
    return this
      .findOne({number: num, novel: id})
      .exec()
  },
  getDirectory: function (options) {
    return this
      .find({ novel: options.novel }, options.attributes)
      .sort({number: options.order})
      .limit()
      .exec()
  }
};

module.exports = mongoose.model('Chapter', ChapterSchema);
