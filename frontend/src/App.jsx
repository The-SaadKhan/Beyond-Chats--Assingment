import { useState, useEffect } from 'react';
import { articleService } from './services/api';
import Header from './components/Header';
import ArticleGrid from './components/ArticleGrid';
import ArticleModal from './components/ArticleModal';
import FilterBar from './components/FilterBar';
import Loader from './components/Loader';
import './App.css';

function App() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'original', 'enhanced'
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchArticles();
  }, [filter]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let params = {};
      if (filter === 'original') {
        params.enhanced = 'false';
      } else if (filter === 'enhanced') {
        params.enhanced = 'true';
      }
      
      const response = await articleService.getAllArticles(params);
      setArticles(response.data || []);
    } catch (err) {
      setError('Failed to fetch articles. Make sure the backend server is running on port 5000.');
      console.error('Error fetching articles:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleArticleClick = (article) => {
    setSelectedArticle(article);
  };

  const handleCloseModal = () => {
    setSelectedArticle(null);
  };

  return (
    <div className="app">
      <Header />
      
      <main className="main-content">
        <div className="container">
          <FilterBar 
            currentFilter={filter} 
            onFilterChange={setFilter}
            articleCount={articles.length}
          />

          {error && (
            <div className="error-banner">
              <span className="error-icon">⚠️</span>
              <p>{error}</p>
            </div>
          )}

          {loading ? (
            <Loader />
          ) : articles.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <h3>No articles found</h3>
              <p>Start by scraping articles from BeyondChats</p>
              <code className="hint">npm run scrape</code>
            </div>
          ) : (
            <ArticleGrid 
              articles={articles} 
              onArticleClick={handleArticleClick}
            />
          )}
        </div>
      </main>

      {selectedArticle && (
        <ArticleModal 
          article={selectedArticle}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

export default App;
