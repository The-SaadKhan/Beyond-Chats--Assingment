import { useEffect } from 'react';
import './ArticleModal.css';

function ArticleModal({ article, onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const renderContent = () => {
    const content = article.content;
    
    // Split by lines and process
    const lines = content.split('\n');
    const elements = [];
    
    lines.forEach((line, index) => {
      line = line.trim();
      if (!line) {
        elements.push(<br key={`br-${index}`} />);
        return;
      }
      
      // Headers
      if (line.startsWith('# ')) {
        elements.push(<h1 key={index}>{line.substring(2)}</h1>);
      } else if (line.startsWith('## ')) {
        elements.push(<h2 key={index}>{line.substring(3)}</h2>);
      } else if (line.startsWith('### ')) {
        elements.push(<h3 key={index}>{line.substring(4)}</h3>);
      }
      // Horizontal rule
      else if (line === '---') {
        elements.push(<hr key={index} />);
      }
      // Links with markdown syntax [text](url)
      else if (line.includes('[') && line.includes('](')) {
        const parts = line.split(/(\[.*?\]\(.*?\))/g);
        const rendered = parts.map((part, i) => {
          const match = part.match(/\[(.*?)\]\((.*?)\)/);
          if (match) {
            return (
              <a key={i} href={match[2]} target="_blank" rel="noopener noreferrer">
                {match[1]}
              </a>
            );
          }
          return part;
        });
        elements.push(<p key={index}>{rendered}</p>);
      }
      // Regular paragraph
      else {
        elements.push(<p key={index}>{line}</p>);
      }
    });
    
    return elements;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>
        
        <div className="modal-content">
          <div className="modal-header">
            {article.isEnhanced && (
              <div className="modal-badge">
                <span className="badge-icon">✨</span>
                <span>AI Enhanced Version</span>
              </div>
            )}
            
            <h1 className="modal-title">{article.title}</h1>
            
            <div className="modal-meta">
              <div className="meta-item">
                <span className="meta-icon">👤</span>
                <span>{article.author}</span>
              </div>
              <div className="meta-item">
                <span className="meta-icon">📅</span>
                <span>{formatDate(article.publishedAt)}</span>
              </div>
              {article.references && article.references.length > 0 && (
                <div className="meta-item">
                  <span className="meta-icon">📚</span>
                  <span>{article.references.length} references</span>
                </div>
              )}
            </div>
          </div>

          <div className="modal-body">
            <div className="article-content-wrapper">
              {renderContent()}
            </div>
            
            {article.originalUrl && (
              <div className="original-source">
                <span className="source-label">Original Source:</span>
                <a 
                  href={article.originalUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="source-link"
                >
                  {article.originalUrl}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArticleModal;
