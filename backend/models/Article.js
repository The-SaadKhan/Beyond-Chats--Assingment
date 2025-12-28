const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  excerpt: {
    type: String,
    default: ''
  },
  author: {
    type: String,
    default: 'BeyondChats'
  },
  imageUrl: {
    type: String,
    default: ''
  },
  originalUrl: {
    type: String,
    default: ''
  },
  isEnhanced: {
    type: Boolean,
    default: false
  },
  originalArticleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Article',
    default: null
  },
  references: [{
    title: String,
    url: String,
    scrapedAt: Date
  }],
  publishedAt: {
    type: Date,
    default: Date.now
  },
  scrapedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Article', ArticleSchema);
