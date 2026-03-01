import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const data = location.state || { percentage: 0, surveyScore: 0, textScore: 0 };
  
  let riskLabel = "Low";
  let message = "You seem to be doing okay! Keep maintaining a healthy lifestyle.";
  let color = "#2ecc71"; // Green

  if (data.percentage > 70) {
    riskLabel = "High";
    message = "It looks like you are going through a difficult time. Please reach out to a professional.";
    color = "#e74c3c"; // Red
  } else if (data.percentage > 40) {
    riskLabel = "Moderate";
    message = "There are signs of stress. It might be helpful to talk to a friend or a professional.";
    color = "#f39c12"; // Orange
  }

  return (
    <div className="result-page">
      <div className="result-container">
        
        <div className="result-header">
        <h2 style={{ fontWeight: '800' }}> Predicted Result for You</h2>
        </div>

        <div className="score-section">
          <div className="score-circle" style={{ borderColor: color }}>
            <span className="score-number" style={{ color: color }}>{data.percentage}%</span>
            <span className="score-label">Depression Level</span>
          </div>
          
          <h2 className="risk-label" style={{ color: color }}>{riskLabel} Risk</h2>
          <p className="result-message">{message}</p>
        </div>

        <div className="bottom-section">
          <div className="details-grid">
            <div className="detail-card">
              <h4>Survey Score</h4>
              <div className="value">{data.surveyScore} / 27</div>
            </div>
            <div className="detail-card">
              <h4>Sentiment</h4>
              <div className="value">
                {data.textScore !== null ? `${data.textScore}%` : 'N/A'}
              </div>
            </div>
          </div>

          <button className="cta-button result-btn" onClick={() => navigate('/assessment')}>
            Take Assessment Again
          </button>
        </div>

      </div>
    </div>
  );
};

export default ResultPage;