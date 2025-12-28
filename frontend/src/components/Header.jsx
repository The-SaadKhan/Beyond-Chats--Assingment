import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo">
              <span className="logo-icon">✨</span>
              <span className="logo-text">BeyondChats</span>
            </div>
            <span className="subtitle">Article Intelligence Platform</span>
          </div>
          
          <div className="header-actions">
            <div className="status-indicator">
              <span className="status-dot"></span>
              <span className="status-text">Live</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
