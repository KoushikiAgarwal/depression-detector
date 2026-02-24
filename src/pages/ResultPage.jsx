import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Default values in case user refreshes page
  const data = location.state || { percentage: 0, surveyScore: 0, textScore: 0 };
  
  let riskLabel = "Low";
  let message = "You seem to be doing okay! Keep maintaining a healthy lifestyle.";
  let color = "#4CAF50"; // Green

  if (data.percentage > 70) {
    riskLabel = "High";
    message = "It looks like you are going through a difficult time. Please remember that seeking help is a sign of strength, not weakness. You don't have to face this alone.";
    color = "#f44336"; // Red
  } else if (data.percentage > 40) {
    riskLabel = "Moderate";
    message = "There are signs of stress. It might be helpful to talk to a friend or a professional. Small steps can make a big difference.";
    color = "#FF9800"; // Orange
  }

  return (
    <div className="page result-page">
      <div className="result-card">
        <h1>Your Assessment Result</h1>
        
        <div className="percentage-circle" style={{ borderColor: color }}>
          <span style={{ color: color }}>{data.percentage}%</span>
        </div>
        
        <h2 style={{ color: color }}>{riskLabel} Risk Detected</h2>
        
        <p className="empathy-message">{message}</p>

        <div className="score-breakdown">
          <div className="score-item">
            <span>Survey Analysis</span>
            <strong>{data.surveyScore} / 27</strong>
          </div>
          <div className="score-item">
            <span>Text Sentiment</span>
            {/* If textScore is null, show 'Not Provided', else show % */}
            <strong>
              {data.textScore !== null ? `${data.textScore}% Risk` : "Not Provided"}
            </strong>
          </div>
        </div>

        <div className="resources-box">
          <h3>Need Help?</h3>
          <p>If you are in crisis, please reach out:</p>
          <ul>
            <li><strong>Kaan Pete Roi</strong> +880 1779-554391 (BD)</li>
    
          </ul>
        </div>

        <button className="cta-button" onClick={() => navigate('/')}>
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default ResultPage;