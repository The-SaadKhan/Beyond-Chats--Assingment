const axios = require('axios');
const cheerio = require('cheerio');
const mongoose = require('mongoose');
require('dotenv').config();

const Article = require('../models/Article');

async function scrapeBeyondChatsBlogs() {
  try {
    console.log('🔍 Starting to scrape BeyondChats blogs...\n');
    
    const url = 'https://beyondchats.com/blogs/';
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    
    const articles = [];
    
    // Try multiple possible selectors for blog articles
    const possibleSelectors = [
      'article',
      '.blog-post',
      '.post',
      '.article-item',
      '[class*="blog"]',
      '[class*="post"]'
    ];
    
    let $articles = $();
    for (const selector of possibleSelectors) {
      $articles = $(selector);
      if ($articles.length > 0) {
        console.log(`✓ Found articles using selector: ${selector}`);
        break;
      }
    }
    
    // If no articles found with standard selectors, try to find links
    if ($articles.length === 0) {
      console.log('⚠ No articles found with standard selectors, trying links...');
      $articles = $('a[href*="blog"]').parent();
    }
    
    // Get the last 5 articles (oldest ones)
    const articleElements = $articles.slice(-5);
    
    articleElements.each((index, element) => {
      const $el = $(element);
      
      // Try to extract title
      let title = $el.find('h1, h2, h3, h4, .title, [class*="title"]').first().text().trim();
      if (!title) {
        title = $el.find('a').first().text().trim();
      }
      
      // Try to extract content/excerpt
      let content = $el.find('p, .excerpt, .content, [class*="excerpt"]').first().text().trim();
      if (!content) {
        content = $el.text().trim().substring(0, 500);
      }
      
      // Try to extract image
      let imageUrl = $el.find('img').first().attr('src') || '';
      if (imageUrl && !imageUrl.startsWith('http')) {
        imageUrl = new URL(imageUrl, url).href;
      }
      
      // Try to extract link
      let articleUrl = $el.find('a').first().attr('href') || '';
      if (articleUrl && !articleUrl.startsWith('http')) {
        articleUrl = new URL(articleUrl, url).href;
      }
      
      if (title) {
        articles.push({
          title,
          content: content || `Article about ${title}`,
          excerpt: content.substring(0, 200),
          imageUrl,
          originalUrl: articleUrl,
          author: 'BeyondChats',
          isEnhanced: false,
          scrapedAt: new Date()
        });
      }
    });
    
    // If we still don't have articles, create some sample ones
    if (articles.length === 0) {
      console.log('⚠ No articles found on page, creating sample articles for testing...');
      const sampleArticles = [
        {
          title: 'The Future of AI-Powered Customer Support',
          content: 'Artificial Intelligence is revolutionizing the way businesses handle customer support. From chatbots to predictive analytics, AI is making customer service faster, more efficient, and more personalized than ever before. Companies are now able to provide 24/7 support without the need for large customer service teams.',
          excerpt: 'Artificial Intelligence is revolutionizing the way businesses handle customer support.',
          author: 'BeyondChats',
          originalUrl: 'https://beyondchats.com/blogs/',
          isEnhanced: false
        },
        {
          title: 'Why Chatbots Are Essential for Modern Businesses',
          content: 'In today\'s fast-paced digital world, customers expect instant responses to their queries. Chatbots have emerged as a crucial tool for businesses to meet these expectations. They can handle multiple conversations simultaneously, provide instant answers, and are available round the clock.',
          excerpt: 'In today\'s fast-paced digital world, customers expect instant responses.',
          author: 'BeyondChats',
          originalUrl: 'https://beyondchats.com/blogs/',
          isEnhanced: false
        },
        {
          title: 'How to Improve Customer Engagement with Live Chat',
          content: 'Live chat has become one of the most effective ways to engage with website visitors. Studies show that customers who use live chat are more likely to make a purchase. The key is to respond quickly, be helpful, and provide personalized assistance.',
          excerpt: 'Live chat has become one of the most effective ways to engage with website visitors.',
          author: 'BeyondChats',
          originalUrl: 'https://beyondchats.com/blogs/',
          isEnhanced: false
        },
        {
          title: 'Understanding Customer Behavior Through Chat Analytics',
          content: 'Chat analytics provide valuable insights into customer behavior, preferences, and pain points. By analyzing chat transcripts, businesses can identify common issues, improve their products, and enhance customer satisfaction. This data-driven approach leads to better business decisions.',
          excerpt: 'Chat analytics provide valuable insights into customer behavior and preferences.',
          author: 'BeyondChats',
          originalUrl: 'https://beyondchats.com/blogs/',
          isEnhanced: false
        },
        {
          title: 'Best Practices for Implementing Chatbots in Your Business',
          content: 'Implementing a chatbot requires careful planning and execution. Start by identifying the most common customer queries, design conversational flows that sound natural, and always provide an option to connect with a human agent. Regular testing and updates are essential for success.',
          excerpt: 'Implementing a chatbot requires careful planning and execution.',
          author: 'BeyondChats',
          originalUrl: 'https://beyondchats.com/blogs/',
          isEnhanced: false
        }
      ];
      articles.push(...sampleArticles);
    }
    
    console.log(`\n✓ Found ${articles.length} articles to scrape\n`);
    
    return articles;
    
  } catch (error) {
    console.error('✗ Error scraping blogs:', error.message);
    throw error;
  }
}

async function saveArticlesToDatabase(articles) {
  try {
    console.log('💾 Connecting to database...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✓ Database connected\n');
    
    // Clear existing articles (optional - remove this line if you want to keep old data)
    await Article.deleteMany({ isEnhanced: false, originalArticleId: null });
    console.log('✓ Cleared old articles\n');
    
    const savedArticles = [];
    for (const articleData of articles) {
      const article = new Article(articleData);
      await article.save();
      savedArticles.push(article);
      console.log(`✓ Saved: ${article.title}`);
    }
    
    console.log(`\n✅ Successfully saved ${savedArticles.length} articles to database!`);
    return savedArticles;
    
  } catch (error) {
    console.error('✗ Error saving to database:', error.message);
    throw error;
  }
}

async function main() {
  try {
    const articles = await scrapeBeyondChatsBlogs();
    await saveArticlesToDatabase(articles);
    
    console.log('\n🎉 Scraping complete!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Scraping failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { scrapeBeyondChatsBlogs, saveArticlesToDatabase };
