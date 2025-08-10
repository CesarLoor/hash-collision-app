const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const hashSchema = new Schema({
  filename: String,
  md5: String,
  sha1: String,
  sha256: String,
  date: { type: Date, default: Date.now },
  user: { type: Schema.Types.ObjectId, ref: 'User' }
});
module.exports = mongoose.model('HashHistory', hashSchema);