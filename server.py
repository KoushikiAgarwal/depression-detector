from flask import Flask, request, jsonify
from flask_cors import CORS
import predictor # Imports your predictor.py file

app = Flask(__name__)
CORS(app) # Allow React to talk to Python

# ==========================================
# MAPPING CONFIGURATION
# ==========================================

# Maps React Keys -> Predictor Keys
# React sends 'q1', Predictor expects "Have little interest..."
QUESTION_MAP = {
    'q1': "Have little interest in doing things",
    'q2': "Feeling down, depressed, or hopeless",
    'q3': "Trouble sleeping or sleeping too much",
    'q4': "Feeling tired or having little energy",
    'q5': "Poor appetite or overeating",
    'q6': "Feeling bad about yourself",
    'q7': "Trouble concentrating on things",
    'q8': "Moving or speaking slowly or too fast",
    'q9': "Thought you would be better off dead"
}

# Maps React Login Keys -> Predictor Keys
# React sends 'gender', Predictor expects "Gender?"
DEMOGRAPHIC_MAP = {
    'gender': 'Gender?',
    'age': 'What is your age group?',
    'marital': 'Marital status',
    'living': 'Where do you live?',
    'support': 'Do you have a close person or friend you can talk to when feeling down?'
}

# ==========================================
# API ROUTE
# ==========================================

@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        
        # 1. PREPARE SURVEY INPUT
        survey_input = {}

        # Map Demographics
        for react_key, predictor_key in DEMOGRAPHIC_MAP.items():
            if react_key in data:
                survey_input[predictor_key] = data[react_key]

        # Map Questions (q1 -> "Have little interest...")
        for i in range(1, 10):
            react_key = f'q{i}'
            if react_key in data:
                predictor_key = QUESTION_MAP[react_key]
                survey_input[predictor_key] = int(data[react_key])

        # 2. PREPARE TEXT INPUT
        text_input = data.get('text', '')

        # 3. CALL META-LEARNER
        print(f"📡 Received request. Text: {text_input[:20]}...")
        result = predictor.predict_depression(
            text_input=text_input if text_input else None,
            survey_input=survey_input
        )

        # 4. RETURN RESULT
        print(f"✅ Result: {result}")
        return jsonify(result)

    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

# ==========================================
# START SERVER
# ==========================================
if __name__ == '__main__':
    print("🚀 Starting Server...")
    
    # Load the heavy models (BERT, etc.) into memory
    if predictor.load_models():
        print("✅ Models ready. Server running on http://localhost:5000")
        app.run(debug=True, port=5000)
    else:
        print("❌ Failed to load models. Check file paths.")