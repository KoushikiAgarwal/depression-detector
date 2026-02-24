import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sentiment from 'sentiment';

const TestPage = () => {
  const navigate = useNavigate();
  
  // Form State
  const [text, setText] = useState('');
  const [answers, setAnswers] = useState({
    q1: 0, q2: 0, q3: 0, q4: 0, q5: 0, q6: 0, q7: 0, q8: 0, q9: 0
  });
  
  // Updated Demographics State
  const [demographics, setDemographics] = useState({
    gender: 'Male',
    age: 'Age 18-22',
    marital: 'Single',
    family: 'Yes',
    living: 'Home',
    support: 'Yes'
  });

  const questions = [
    "Little interest or pleasure in doing things?",
    "Feeling down, depressed, or hopeless?",
    "Trouble falling or staying asleep, or sleeping too much?",
    "Feeling tired or having little energy?",
    "Poor appetite or overeating?",
    "Feeling bad about yourself — or that you are a failure?",
    "Trouble concentrating on things?",
    "Moving or speaking slowly, or being restless?",
    "Thoughts that you would be better off dead?"
  ];

  const handleSliderChange = (e, key) => {
    setAnswers({ ...answers, [key]: parseInt(e.target.value) });
  };

  const handleDemoChange = (e) => {
    const { name, value } = e.target;
    setDemographics({ ...demographics, [name]: value });
  };

  // --- FIXED LOGIC: No more 10% for 0 score ---
  const calculateDepression = () => {
    // 1. Survey Score Logic
    const totalScore = Object.values(answers).reduce((a, b) => a + b, 0);
    
    let surveyProb = 0;
    
    // FIXED: Specific check for score 0
    if (totalScore === 0) {
      surveyProb = 0.00; // 0% Risk if perfect score
    } else if (totalScore <= 4) {
      surveyProb = 0.05; // 5% - Minimal symptoms
    } else if (totalScore <= 9) {
      surveyProb = 0.30; // 30% - Mild
    } else if (totalScore <= 14) {
      surveyProb = 0.50; // 50% - Moderate
    } else if (totalScore <= 19) {
      surveyProb = 0.70; // 70% - Mod-Severe
    } else {
      surveyProb = 0.90; // 90% - Severe
    }

    // 2. Text Score Logic
    const sentimentAnalyzer = new Sentiment();
    let textProb = null;
    
    if (text.trim().length > 0) {
      const result = sentimentAnalyzer.analyze(text);
      let comparative = result.comparative;

      if (comparative < 0) {
        textProb = Math.min(1, Math.abs(comparative) * 2); 
      } else {
        textProb = Math.max(0, 0.5 - (comparative * 0.5));
      }
    }

    // 3. Ensemble Logic
    let finalProb;

    if (textProb !== null) {
      finalProb = (0.5 * textProb) + (0.5 * surveyProb);
    } else {
      finalProb = surveyProb;
    }

    const finalPercentage = Math.round(finalProb * 100);

    navigate('/result', { 
      state: { 
        percentage: finalPercentage, 
        surveyScore: totalScore,
        textScore: textProb !== null ? Math.round(textProb * 100) : null,
        inputText: text 
      } 
    });
  };

  return (
    <div className="page test-page">
      <div className="form-container">
        <h2>Tell us about yourself</h2>
        
        {/* Demographics Section */}
        <div className="demo-section">
          
          <div className="input-group">
            <label>Gender</label>
            <select name="gender" onChange={handleDemoChange}>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>

          <div className="input-group">
            <label>Marital Status</label>
            <select name="marital" onChange={handleDemoChange}>
              <option>Single</option>
              <option>Married</option>
              <option>In relationship</option>
              <option>Divorced</option>
            </select>
          </div>

          <div className="input-group">
            <label>Age Range</label>
            <select name="age" onChange={handleDemoChange}>
              <option>Age 18-22</option>
              <option>Age 23-25</option>
              <option>Age 26-35</option>
              <option>Age 36-50</option>
              <option>Age 50+</option>
            </select>
          </div>

          <div className="input-group">
            <label>Do you live with family?</label>
            <select name="family" onChange={handleDemoChange}>
              <option>Yes</option>
              <option>No</option>
              <option>Sometimes</option>
            </select>
          </div>

        </div>

        <h2>Over the last 2 weeks, how often have you been bothered by...</h2>
        
        {/* Questions Section */}
        <div className="questions-section">
          {questions.map((q, i) => (
            <div key={i} className="question-item">
              <p>{q}</p>
              <div className="slider-group">
                <span>Not at all</span>
                <input 
                  type="range" 
                  min="0" max="3" 
                  value={answers[`q${i+1}`]} 
                  onChange={(e) => handleSliderChange(e, `q${i+1}`)}
                />
                <span>Nearly every day</span>
                <strong>{answers[`q${i+1}`]}</strong>
              </div>
            </div>
          ))}
        </div>

        <h2>Your Thoughts</h2>
        <p className="sub-text">Share what's on your mind. This helps us understand you better.</p>
        <textarea 
          className="thoughts-input"
          placeholder="I've been feeling..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>

        <button className="submit-button" onClick={calculateDepression}>
          Analyze My Mental Health
        </button>
      </div>
    </div>
  );
};

export default TestPage;