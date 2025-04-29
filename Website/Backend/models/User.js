const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  hostname: { type: String, required: true }, // <-- ADD THIS
  password: { type: String, required: true },
  ipAddress: { type: String, required: true },
  role: { type: String, enum: ['cloud', 'local'], required: true },
});


module.exports = mongoose.model('User', userSchema);
