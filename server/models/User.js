const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  socketId: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
