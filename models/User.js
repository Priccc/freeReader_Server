const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    unique: true,//不可重复约束
    require: true //不可为空约束
  },
  password: {
    type: String,
    require: true //不可为空约束
  },
  head_portrait: { type: String },
  novels: [{
    novel: {
      type: Schema.Types.ObjectId,
      ref: 'Novel',
    },
    reading: {
      type: Schema.Types.ObjectId,
      ref: 'ReadingList',
    },
  }],
  // novel_list: [{
  //   type: Schema.Types.ObjectId,
  //   ref: 'Novel',
  // }],
  // reading_list: [{
  //   type: Schema.Types.ObjectId,
  //   ref: 'ReadingList',
  // }],
  last_visit_time: { type: Date },
  phone: {
    type: String,
    unique: true,//不可重复约束
  },
  email: {
    type: String,
    unique: true,//不可重复约束
  },
  is_true: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model('User', UserSchema);
