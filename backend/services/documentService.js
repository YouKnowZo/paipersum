const Document = require('../models/Document');
const schedule = require('node-schedule');

// Auto-purge documents after 24h
const retentionJob = schedule.scheduleJob('0 0 * * *', async () => {
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
  await Document.deleteMany({ createdAt: { $lt: cutoff } });
  console.log(`[Retention] Purged documents older than 24h`);
});

exports.storeDocument = async (content, userId) => {
  const doc = await Document.create({
    content: encrypt(content),
    user: userId,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24h TTL
  });
  return doc._id;
};

// In backend/models/Document.js:
const mongoose = require('mongoose');
const { encrypt } = require('./security');

const DocumentSchema = new mongoose.Schema({
  content: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  expiresAt: { type: Date, index: { expires: 0 } } // Auto-delete
}, { timestamps: true });