import './FilterBar.css';

function FilterBar({ currentFilter, onFilterChange, articleCount }) {
  const filters = [
    { id: 'all', label: 'All Articles', icon: '📚' },
    { id: 'original', label: 'Original', icon: '📄' },
    { id: 'enhanced', label: 'AI Enhanced', icon: '✨' }
  ];

  return (
    <div className="filter-bar">
      <div className="filter-header">
        <h2 className="filter-title">Article Collection</h2>
        <span className="article-count">{articleCount} articles</span>
      </div>
      
      <div className="filter-buttons">
        {filters.map(filter => (
          <button
            key={filter.id}
            className={`filter-btn ${currentFilter === filter.id ? 'active' : ''}`}
            onClick={() => onFilterChange(filter.id)}
          >
            <span className="filter-icon">{filter.icon}</span>
            <span className="filter-label">{filter.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default FilterBar;
