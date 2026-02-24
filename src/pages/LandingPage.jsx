import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="page landing-page">
      <div className="overlay">
        <div className="content">
          <h1>You Are Not Alone</h1>
          <p className="quote">
            "It is okay not to be okay. Your feelings are valid, and there is hope even in the darkest moments. Taking the first step to understand yourself is an act of courage."
          </p>
          <button className="cta-button" onClick={() => navigate('/test')}>
            Take the Assessment
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;