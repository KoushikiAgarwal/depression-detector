import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1 className="logo">SoulSync</h1>
        <span className="tagline">A Depression Detection System</span>
      </div>

      <nav className="sidebar-nav">
        <button onClick={() => navigate('/')} className={`nav-item ${isActive('/')}`}>
          <span className="icon">🏠</span> Home
        </button>
        
        <button onClick={() => navigate('/test')} className={`nav-item ${isActive('/test')}`}>
          <span className="icon">📝</span> Assessment
        </button>

        <button onClick={() => navigate('/result')} className={`nav-item ${isActive('/result')}`}>
          <span className="icon">📊</span> Detection Result
        </button>
      </nav>

      {/* NEW: Image at the bottom left */}
      <img src="/soulsync1.png" alt="SoulSync Brand" className="sidebar-brand-image" />
    </div>
  );
};

export default Sidebar;