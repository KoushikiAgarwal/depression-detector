import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import predictor # Imports your predictor.py file

app = Flask(__name__)
CORS(app)

# ==========================================
# MAPPING CONFIGURATION
# ==========================================

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

DEMOGRAPHIC_MAP = {
    'gender': 'Gender?',
    'age': 'What is your age group?',
    'marital': 'Marital status',
    'living': 'Where do you live?',
    'support': 'Do you have a close person or friend you can talk to when feeling down?'
}

@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        survey_input = {}

        # Map Demographics
        for react_key, predictor_key in DEMOGRAPHIC_MAP.items():
            if react_key in data:
                survey_input[predictor_key] = data[react_key]

        # Map Questions
        for i in range(1, 10):
            react_key = f'q{i}'
            if react_key in data:
                predictor_key = QUESTION_MAP[react_key]
                survey_input[predictor_key] = int(data[react_key])

        text_input = data.get('text', '')

        print(f"Received request...")
        result = predictor.predict_depression(
            text_input=text_input if text_input else None,
            survey_input=survey_input
        )
        return jsonify(result)

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Get Port from Render Environment
    port = int(os.environ.get('PORT', 5000))
    
    print(f"Starting Python Server on port {port}...")
    
    if predictor.load_models():
        print("Models loaded successfully.")
        # Run on 0.0.0.0 for Render
        app.run(host='0.0.0.0', port=port, debug=False)
    else:
        print("Failed to load models.")