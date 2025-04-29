const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  name: String,
  type: String,
  size: Number,
  uploadedAt: Date,
});

module.exports = mongoose.model('File', fileSchema);
