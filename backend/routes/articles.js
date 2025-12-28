const express = require('express');
const router = express.Router();
const Article = require('../models/Article');

// CREATE - Add new article
router.post('/', async (req, res) => {
  try {
    const article = new Article(req.body);
    await article.save();
    res.status(201).json({
      success: true,
      message: 'Article created successfully',
      data: article
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create article',
      error: error.message
    });
  }
});

// READ - Get all articles
router.get('/', async (req, res) => {
  try {
    const { enhanced, limit, sort } = req.query;
    
    let query = {};
    if (enhanced !== undefined) {
      query.isEnhanced = enhanced === 'true';
    }

    const articles = await Article.find(query)
      .populate('originalArticleId')
      .sort(sort === 'newest' ? { createdAt: -1 } : { createdAt: 1 })
      .limit(parseInt(limit) || 0);

    res.json({
      success: true,
      count: articles.length,
      data: articles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch articles',
      error: error.message
    });
  }
});

// READ - Get single article
router.get('/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id)
      .populate('originalArticleId');
    
    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    res.json({
      success: true,
      data: article
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch article',
      error: error.message
    });
  }
});

// UPDATE - Update article
router.put('/:id', async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    res.json({
      success: true,
      message: 'Article updated successfully',
      data: article
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update article',
      error: error.message
    });
  }
});

// DELETE - Delete article
router.delete('/:id', async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    res.json({
      success: true,
      message: 'Article deleted successfully',
      data: article
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete article',
      error: error.message
    });
  }
});

// GET - Get enhanced version of an article
router.get('/:id/enhanced', async (req, res) => {
  try {
    const enhancedArticle = await Article.findOne({
      originalArticleId: req.params.id,
      isEnhanced: true
    });

    if (!enhancedArticle) {
      return res.status(404).json({
        success: false,
        message: 'Enhanced version not found'
      });
    }

    res.json({
      success: true,
      data: enhancedArticle
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch enhanced article',
      error: error.message
    });
  }
});

module.exports = router;
