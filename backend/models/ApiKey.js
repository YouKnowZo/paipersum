const mongoose = require('mongoose');

const ApiKeySchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  tier: { type: String, enum: ['free', 'pro', 'enterprise'], default: 'free' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  revoked: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('ApiKey', ApiKeySchema);
