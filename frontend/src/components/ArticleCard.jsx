import './ArticleCard.css';

function ArticleCard({ article, onClick, index }) {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <article 
      className="article-card"
      onClick={onClick}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="card-header">
        <div className="card-meta">
          <div className="author-avatar">
            {getInitials(article.author || 'BC')}
          </div>
          <div className="meta-info">
            <span className="author-name">{article.author}</span>
            <span className="publish-date">{formatDate(article.publishedAt)}</span>
          </div>
        </div>
        
        {article.isEnhanced && (
          <div className="enhanced-badge">
            <span className="badge-icon">✨</span>
            <span className="badge-text">AI Enhanced</span>
          </div>
        )}
      </div>

      <div className="card-content">
        <h3 className="article-title">{article.title}</h3>
        <p className="article-excerpt">
          {article.excerpt || article.content.substring(0, 150)}...
        </p>
      </div>

      <div className="card-footer">
        <button className="read-more-btn">
          <span>Read Full Article</span>
          <span className="arrow">→</span>
        </button>
        
        {article.references && article.references.length > 0 && (
          <div className="references-indicator">
            <span className="ref-icon">📚</span>
            <span className="ref-count">{article.references.length} sources</span>
          </div>
        )}
      </div>
    </article>
  );
}

export default ArticleCard;
