import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <div className="landing-content">
        <h2 className="hero-quote">
          "Sometimes the bravest thing you can do is ask for help."
        </h2>
        <p className="hero-subtext">
          You are not alone. Take the first step towards understanding your mental health.
        </p>
        <button className="cta-button" onClick={() => navigate('/login')}>
          Take the Assessment
        </button>
      </div>
    </div>
  );
};

export default LandingPage;