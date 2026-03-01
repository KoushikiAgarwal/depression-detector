import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showAssessmentMenu, setShowAssessmentMenu] = useState(false);

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <header className="main-header">
      <div className="header-brand" onClick={() => navigate('/')}>
        <img 
          src={`${import.meta.env.BASE_URL}soulsync1.png`} 
          alt="SoulSync Logo" 
          className="header-logo" 
        />
        {/* Updated Text Structure */}
        <div className="brand-text">
          <span className="text-white">Soul</span>
          <span className="text-accent">Sync</span>
        </div>
      </div>

      <nav className="header-nav">
        <button onClick={() => navigate('/')} className={`nav-link ${isActive('/')}`}>
          <span className="nav-icon">🏠</span>
          <span>Home</span>
        </button>

        <button onClick={() => navigate('/login')} className={`nav-link ${isActive('/login')}`}>
          <span className="nav-icon">🔑</span>
          <span>Login</span>
        </button>

        <div 
          className="nav-dropdown"
          onMouseEnter={() => setShowAssessmentMenu(true)}
          onMouseLeave={() => setShowAssessmentMenu(false)}
        >
          <button className={`nav-link ${location.pathname.startsWith('/assessment') ? 'active' : ''}`}>
            <span className="nav-icon">📝</span>
            <span>Assessment</span>
          </button>
          {showAssessmentMenu && (
            <div className="dropdown-menu">
              <button onClick={() => navigate('/assessment')}>
                <span className="nav-icon">1️⃣</span> Step 1: Questions
              </button>
              <button onClick={() => navigate('/assessment')}>
                <span className="nav-icon">2️⃣</span> Step 2: Thoughts
              </button>
            </div>
          )}
        </div>

        <button onClick={() => navigate('/result')} className={`nav-link ${isActive('/result')}`}>
          <span className="nav-icon">📊</span>
          <span>Result</span>
        </button>
      </nav>
    </header>
  );
};

export default Header;