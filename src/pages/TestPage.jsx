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
    <div className="test-page">
      <h1 className="page-title">Predicted Result for You</h1>

      {/* 1. Demographics Section */}
      <div className="section-card">
        <h3 style={{marginBottom: '20px'}}>Personal Information</h3>
        <div className="demo-grid">
          <div className="form-group">
            <label>Gender</label>
            <select name="gender" onChange={handleDemoChange}>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Marital Status</label>
            <select name="marital" onChange={handleDemoChange}>
              <option>Single</option>
              <option>Married</option>
              <option>In relationship</option>
              <option>Divorced</option>
            </select>
          </div>

          <div className="form-group">
            <label>Age Range</label>
            <select name="age" onChange={handleDemoChange}>
              <option>Age 18-22</option>
              <option>Age 23-25</option>
              <option>Age 26-35</option>
              <option>Age 36-50</option>
              <option>Age 50+</option>
            </select>
          </div>

          <div className="form-group">
            <label>Do you live with family?</label>
            <select name="family" onChange={handleDemoChange}>
              <option>Yes</option>
              <option>No</option>
              <option>Sometimes</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. PHQ-9 Questions */}
      <div className="section-card">
        <h3 style={{marginBottom: '20px'}}>Assessment Questions</h3>
        <p style={{color: '#666', marginBottom: '20px'}}>Over the last 2 weeks, how often have you been bothered by...</p>
        
        {questions.map((q, i) => (
          <div key={i} className="question-card">
            <p className="question-text">{i+1}. {q}</p>
            <div className="options-grid">
              {[0, 1, 2, 3].map((val) => (
                <button 
                  key={val} 
                  className={`option-btn ${answers[`q${i+1}`] === val ? 'selected' : ''}`}
                  onClick={() => handleSliderChange({ target: { value: val } }, `q${i+1}`)}
                >
                  {val === 0 ? 'Not at all' : val === 1 ? 'Several' : val === 2 ? 'More than half' : 'Nearly every day'}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 3. Thoughts Section */}
      <div className="section-card">
        <h3>Your Thoughts</h3>
        <p style={{color: '#666', fontSize: '0.9rem'}}>Share what's on your mind </p>
        <textarea 
          className="thoughts-box"
          placeholder="I've been feeling..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>
        
        <button className="submit-btn" onClick={calculateDepression}>
          Analyze My Mental Health
        </button>
      </div>
    </div>
  );
}; // <--- This was missing in your code!

export default TestPage;