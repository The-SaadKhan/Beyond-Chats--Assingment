import ArticleCard from './ArticleCard';
import './ArticleGrid.css';

function ArticleGrid({ articles, onArticleClick }) {
  return (
    <div className="article-grid">
      {articles.map((article, index) => (
        <ArticleCard
          key={article._id}
          article={article}
          onClick={() => onArticleClick(article)}
          index={index}
        />
      ))}
    </div>
  );
}

export default ArticleGrid;
