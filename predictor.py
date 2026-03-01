
import pandas as pd
import numpy as np
import torch
import joblib
from transformers import BertTokenizer, BertModel
import os

# ==========================================
# 1. Global Setup & Model Loading
# ==========================================

# Determine device (GPU if available, else CPU)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Define paths (Assumes models are in the same directory)
REDDIT_MODEL_PATH = 'reddit_lr_model.pkl'
SURVEY_MODEL_PATH = 'survey_model_calculated.pkl'

# Initialize variables
reddit_model = None
survey_model = None
survey_columns = None
tokenizer = None
bert_model = None

def load_models():
    """
    Loads all models into memory. 
    Call this ONCE when your web server starts.
    """
    global reddit_model, survey_model, survey_columns, tokenizer, bert_model
    
    print("⏳ Loading Depression Detection Models...")
    
    try:
        # Load Reddit Model
        reddit_model = joblib.load(REDDIT_MODEL_PATH)
        
        # Load Survey Model
        pkg = joblib.load(SURVEY_MODEL_PATH)
        survey_model = pkg['model']
        survey_columns = pkg['columns']
        
        # Load BERT
        tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
        bert_model = BertModel.from_pretrained('bert-base-uncased').to(device)
        bert_model.eval()
        
        print("✅ All models loaded successfully.")
        return True
    except Exception as e:
        print(f"❌ Error loading models: {e}")
        return False

# ==========================================
# 2. Core Logic Functions
# ==========================================

def get_reddit_score(text):
    """
    Input: Raw Text String
    Output: Probability (0.0 to 1.0)
    """
    if not text or text.strip() == "": return None
    
    # Tokenize
    inputs = tokenizer(text, return_tensors="pt", padding=True, truncation=True, max_length=128).to(device)
    
    # Get Embedding
    with torch.no_grad():
        outputs = bert_model(**inputs)
    
    embedding = outputs.last_hidden_state[:, 0, :].cpu().numpy()
    
    # Predict
    prob = reddit_model.predict_proba(embedding)[0][1]
    return prob

def get_survey_score(user_answers_dict):
    """
    Input: Dictionary of Form Answers
    Output: Probability (0.0 to 1.0)
    """
    if not user_answers_dict: return None
    
    # Create DataFrame
    df_input = pd.DataFrame([user_answers_dict])
    
    # One-Hot Encode
    df_encoded = pd.get_dummies(df_input)
    
    # Align Columns (Critical for correct prediction)
    df_aligned = df_encoded.reindex(columns=survey_columns, fill_value=0)
    
    # Predict
    prob = survey_model.predict_proba(df_aligned)[0][1]
    return prob

# ==========================================
# 3. Meta-Learner (The Main Function)
# ==========================================

def predict_depression(text_input=None, survey_input=None):
    """
    Main API Function.
    Accepts Text, Survey Answers, or Both.
    Returns a JSON-ready dictionary.
    """
    
    # 1. Get Base Probabilities
    reddit_prob = get_reddit_score(text_input) if text_input else None
    survey_prob = get_survey_score(survey_input) if survey_input else None
    
    # 2. Ensemble Logic (Weighted Average)
    
    # Case A: Both provided (Best Case)
    if reddit_prob is not None and survey_prob is not None:
        # Weighted: 40% Reddit, 60% Survey (Clinical is more trusted)
        final_prob = (0.4 * reddit_prob) + (0.6 * survey_prob)
        source = "Ensemble (Text + Form)"
    
    # Case B: Only Survey
    elif survey_prob is not None:
        final_prob = survey_prob
        source = "Form Only"
    
    # Case C: Only Text
    elif reddit_prob is not None:
        final_prob = reddit_prob
        source = "Text Only"
    
    # Case D: Nothing
    else:
        return {"error": "No input provided"}

    # 3. Format Result
    percentage = final_prob * 100
    
    # Determine Label
    if percentage > 60:
        risk_label = "High Risk"
    elif percentage > 30:
        risk_label = "Moderate Risk"
    else:
        risk_label = "Low Risk"
    
    return {
        "success": True,
        "percentage": round(percentage, 2),
        "risk_label": risk_label,
        "source": source,
        "details": {
            "text_score": round(reddit_prob * 100, 2) if reddit_prob else None,
            "form_score": round(survey_prob * 100, 2) if survey_prob else None
        }
    }

# ==========================================
# 4. Example Usage (For Testing)
# ==========================================
if __name__ == "__main__":
    # This block runs if you run the script directly
    if load_models():
        # Simulate input
        sample_text = "I feel very tired and lonely."
        sample_form = {
            'Gender?': 'Male',
            'What is your age group?': 'Age 18-22',
            'Marital status': 'Single',
            'Where do you live?': 'Hostel',
            'Do you have a close person or friend you can talk to when feeling down?': 'No',
            "Have little interest in doing things": 2,
            "Feeling down, depressed, or hopeless": 2,
            "Trouble sleeping or sleeping too much": 1,
            "Feeling tired or having little energy": 2,
            "Poor appetite or overeating": 1,
            "Feeling bad about yourself": 1,
            "Trouble concentrating on things": 1,
            "Moving or speaking slowly or too fast": 0,
            "Thought you would be better off dead": 0
        }
        
        result = predict_depression(text_input=sample_text, survey_input=sample_form)
        print("\n RESULT:", result)
