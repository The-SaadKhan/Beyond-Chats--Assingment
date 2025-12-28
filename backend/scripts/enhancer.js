const axios = require('axios');
const cheerio = require('cheerio');
const mongoose = require('mongoose');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const Article = require('../models/Article');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function searchGoogle(query) {
  try {
    console.log(`🔍 Searching Google for: "${query}"`);
    
    const response = await axios.get('https://serpapi.com/search', {
      params: {
        q: query,
        api_key: process.env.SERPAPI_KEY,
        num: 10
      }
    });
    
    const results = response.data.organic_results || [];
    
    // Filter for blog/article URLs (avoid social media, videos, etc.)
    const blogResults = results.filter(result => {
      const url = result.link.toLowerCase();
      return (
        !url.includes('youtube.com') &&
        !url.includes('facebook.com') &&
        !url.includes('twitter.com') &&
        !url.includes('linkedin.com') &&
        !url.includes('instagram.com') &&
        !url.includes('pinterest.com')
      );
    }).slice(0, 2);
    
    console.log(`✓ Found ${blogResults.length} relevant articles\n`);
    
    return blogResults.map(result => ({
      title: result.title,
      url: result.link,
      snippet: result.snippet
    }));
    
  } catch (error) {
    console.error('✗ Error searching Google:', error.message);
    return [];
  }
}

async function scrapeArticleContent(url) {
  try {
    console.log(`📄 Scraping content from: ${url}`);
    
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    
    // Remove unwanted elements
    $('script, style, nav, header, footer, aside, .ad, .advertisement').remove();
    
    // Try multiple selectors to find main content
    let content = '';
    const contentSelectors = [
      'article',
      'main',
      '.post-content',
      '.entry-content',
      '.article-content',
      '.content',
      '[class*="content"]'
    ];
    
    for (const selector of contentSelectors) {
      const $content = $(selector);
      if ($content.length > 0) {
        content = $content.text().trim();
        if (content.length > 500) break;
      }
    }
    
    // If still no content, get all paragraphs
    if (!content || content.length < 500) {
      content = $('p').map((i, el) => $(el).text()).get().join('\n\n');
    }
    
    // Clean up content
    content = content
      .replace(/\s+/g, ' ')
      .replace(/\n\s*\n/g, '\n\n')
      .trim()
      .substring(0, 5000); // Limit length
    
    console.log(`✓ Scraped ${content.length} characters\n`);
    
    return content;
    
  } catch (error) {
    console.error(`✗ Error scraping ${url}:`, error.message);
    return '';
  }
}

async function enhanceArticleWithGemini(originalArticle, referenceArticles) {
  try {
    console.log(`✨ Enhancing article with Gemini AI...\n`);
    
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `You are a professional content writer. I need you to rewrite and enhance the following article.

ORIGINAL ARTICLE:
Title: ${originalArticle.title}
Content: ${originalArticle.content}

REFERENCE ARTICLES (top-ranking on Google):
${referenceArticles.map((ref, i) => `
Reference ${i + 1}:
Title: ${ref.title}
URL: ${ref.url}
Content: ${ref.content.substring(0, 2000)}...
`).join('\n')}

YOUR TASK:
1. Rewrite the original article to match the tone, style, and formatting of the reference articles
2. Make it more engaging, professional, and SEO-friendly
3. Add relevant headings and structure
4. Keep the core message but improve the content quality
5. Make it approximately 800-1200 words
6. Use a conversational but professional tone
7. Include actionable insights and practical examples

Return ONLY the enhanced article content (no title, we'll use the original title).`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const enhancedContent = response.text();
    
    console.log(`✓ Article enhanced successfully\n`);
    
    return enhancedContent;
    
  } catch (error) {
    console.error('✗ Error enhancing with Gemini:', error.message);
    return originalArticle.content;
  }
}

async function processArticle(article) {
  try {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Processing: ${article.title}`);
    console.log('='.repeat(60) + '\n');
    
    // Step 1: Search Google
    const searchResults = await searchGoogle(article.title);
    
    if (searchResults.length === 0) {
      console.log('⚠ No search results found, skipping...\n');
      return null;
    }
    
    // Step 2: Scrape reference articles
    const referenceArticles = [];
    for (const result of searchResults) {
      const content = await scrapeArticleContent(result.url);
      if (content) {
        referenceArticles.push({
          title: result.title,
          url: result.url,
          content: content
        });
      }
    }
    
    if (referenceArticles.length === 0) {
      console.log('⚠ Could not scrape any reference articles, skipping...\n');
      return null;
    }
    
    // Step 3: Enhance with Gemini
    const enhancedContent = await enhanceArticleWithGemini(article, referenceArticles);
    
    // Step 4: Add citations
    const citationsSection = `\n\n---\n\n## References\n\nThis article was enhanced based on insights from the following sources:\n\n${referenceArticles.map((ref, i) => 
      `${i + 1}. [${ref.title}](${ref.url})`
    ).join('\n')}`;
    
    const finalContent = enhancedContent + citationsSection;
    
    // Step 5: Create enhanced article
    const enhancedArticle = new Article({
      title: article.title,
      content: finalContent,
      excerpt: enhancedContent.substring(0, 200),
      author: article.author,
      imageUrl: article.imageUrl,
      originalUrl: article.originalUrl,
      isEnhanced: true,
      originalArticleId: article._id,
      references: referenceArticles.map(ref => ({
        title: ref.title,
        url: ref.url,
        scrapedAt: new Date()
      })),
      publishedAt: new Date()
    });
    
    await enhancedArticle.save();
    
    console.log(`✅ Enhanced article saved successfully!\n`);
    
    return enhancedArticle;
    
  } catch (error) {
    console.error(`✗ Error processing article:`, error.message);
    return null;
  }
}

async function main() {
  try {
    console.log('\n🚀 Starting Article Enhancement Process...\n');
    
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✓ Database connected\n');
    
    // Fetch original articles (not enhanced)
    const articles = await Article.find({ 
      isEnhanced: false,
      originalArticleId: null 
    });
    
    console.log(`Found ${articles.length} articles to enhance\n`);
    
    // Process each article
    let successCount = 0;
    for (const article of articles) {
      const result = await processArticle(article);
      if (result) {
        successCount++;
      }
      
      // Add delay between articles to avoid rate limiting
      console.log('⏳ Waiting 3 seconds before next article...\n');
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
    
    console.log('\n' + '='.repeat(60));
    console.log(`🎉 Enhancement Complete!`);
    console.log(`✓ Successfully enhanced ${successCount} out of ${articles.length} articles`);
    console.log('='.repeat(60) + '\n');
    
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ Enhancement failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { processArticle, searchGoogle, scrapeArticleContent, enhanceArticleWithGemini };
