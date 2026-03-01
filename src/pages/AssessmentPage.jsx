import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// Removed Sentiment import - we don't need it anymore, Python does the work!

const AssessmentPage = () => {
  const navigate = useNavigate();
  
  // Steps: 1 (Q1-3), 2 (Q4-6), 3 (Q7-9), 4 (Text)
  const [step, setStep] = useState(1); 
  const [text, setText] = useState('');
  const [demographics, setDemographics] = useState(null);
  
  const [answers, setAnswers] = useState({
    q1: 0, q2: 0, q3: 0, q4: 0, q5: 0, q6: 0, q7: 0, q8: 0, q9: 0
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

  useEffect(() => {
    const data = localStorage.getItem('userDemographics');
    if (data) setDemographics(JSON.parse(data));
  }, []);

  const handleOptionChange = (key, value) => {
    setAnswers({ ...answers, [key]: value });
  };

  // ==========================================
  // UPDATED: Connect to Python Backend
  // ==========================================
  const calculateDepression = async () => {
    // 1. Gather Demographics (Gender, Age, etc.)
    const userDemographics = JSON.parse(localStorage.getItem('userDemographics') || '{}');

    // 2. Calculate Survey Score (just for display purposes)
    const surveyScore = Object.values(answers).reduce((a, b) => a + b, 0);

    // 3. Prepare Payload to send to Python
    const payload = {
      ...answers,           // q1: 0, q2: 1...
      text: text,           // "I feel sad..."
      ...userDemographics   // gender: "Male", age: "Age 18-22"...
    };

    try {
      // 4. Send to Python Backend
      const response = await fetch('http://localhost:5000/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      // 5. Handle Result
      if (result.success) {
        navigate('/result', { 
          state: { 
            percentage: result.percentage, 
            surveyScore: surveyScore,
            textScore: result.details.text_score,
            riskLabel: result.risk_label
          } 
        });
      } else {
        alert("Prediction failed: " + (result.error || "Unknown error"));
      }

    } catch (error) {
      console.error("Error connecting to model:", error);
      alert("Could not connect to Python Model. Make sure server.py is running!");
    }
  };

  // --- RENDER STEPS ---

  // Generic renderer for question steps
  const renderQuestionStep = (stepNum, questionIndices, title) => (
    <div className="assessment-content">
      <div className="step-indicator">Step 1: Questions (Part {stepNum}/3)</div>
      <h2>{title}</h2>
      
      <div className="questions-container">
        {questionIndices.map((i) => (
          <div key={i} className="question-card-static">
            <p className="question-text">{i+1}. {questions[i]}</p>
            <div className="options-grid">
              {[0, 1, 2, 3].map((val) => (
                <button 
                  key={val} 
                  className={`option-btn ${answers[`q${i+1}`] === val ? 'selected' : ''}`}
                  onClick={() => handleOptionChange(`q${i+1}`, val)}
                >
                  {val === 0 ? 'Not at all' : val === 1 ? 'Several' : val === 2 ? 'More than half' : 'Nearly every day'}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="nav-buttons">
        {step > 1 && <button className="back-btn" onClick={() => setStep(step - 1)}>← Back</button>}
        <button className="next-btn" onClick={() => setStep(step + 1)}>Next →</button>
      </div>
    </div>
  );

  // Step 4: Text Thoughts
  const renderTextStep = () => (
    <div className="assessment-content">
      <div className="step-indicator">Step 2: Your Thoughts</div>
      <h2>Share your feelings </h2>
      
      <div className="questions-container">
        <textarea 
          className="thoughts-box"
          placeholder="I've been feeling..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>
      </div>

      <div className="nav-buttons">
        <button className="back-btn" onClick={() => setStep(3)}>← Back</button>
        <button className="next-btn" onClick={calculateDepression}>
          Analyze My Mental Health
        </button>
      </div>
    </div>
  );

  return (
    <div className="page assessment-page">
      {step === 1 && renderQuestionStep(1, [0, 1, 2], "Over the last 2 weeks...")}
      {step === 2 && renderQuestionStep(2, [3, 4, 5], "Continuing Assessment...")}
      {step === 3 && renderQuestionStep(3, [6, 7, 8], "Final Questions...")}
      {step === 4 && renderTextStep()}
    </div>
  );
};

export default AssessmentPage;