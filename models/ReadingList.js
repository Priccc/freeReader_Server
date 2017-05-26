const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReadingListSchema = new Schema({
  // user_id: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'User',
  //   unique: true,//不可重复约束
  //   require: true //不可为空约束
  // },
  // novel_id: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'Novel',
  //   unique: true,//不可重复约束
  //   require: true //不可为空约束
  // },
  progress: {
    type: String,
    default: '0'
  },
  is_true: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model('ReadingList', ReadingListSchema);
