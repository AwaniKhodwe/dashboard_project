from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Ensure API key is set
api_key = os.getenv("API_KEY")
if not api_key:
    raise ValueError("API_KEY environment variable is not set. Add it to your .env file.")

# Configure Gemini AI
genai.configure(api_key=api_key)

app = Flask(__name__)
CORS(app)  # Allow CORS for communication with React frontend

# Store the dataset globally (optional, for simplicity)
df = None

@app.route('/upload', methods=['POST'])
def upload_file():
    global df
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    try:
        # Read the CSV file
        df = pd.read_csv(file)
        
        # Determine column types
        column_types = {}
        for column in df.columns:
            # print(column,pd.api.types.is_numeric_dtype(df[column]))
            if pd.api.types.is_numeric_dtype(df[column]):
                column_types[column] = "numerical"
            else:
                column_types[column] = "categorical"

        # Generate AI-driven chart suggestions
        prompt = (
            "From the column names you know, suggest two column names for each of the charts: "
            "1. LineChart, 2. BarChart, 3. PieChart, 4. Scatter Plot, 5. Histogram. "
            "If it's not possible to create a chart, keep the column names blank for that chart."
            "Give the response in a json format"
        )
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(
            f"{prompt}\n\nColumn names: {', '.join(df.columns)}"
        )

        # print(response.text)

        # Convert the AI's response into a structured dictionary
        suggestions = response.text

        # print("Suggestions:")
        # print(suggestions)

        # Return results
        return jsonify({
            'columns': list(df.columns),
            'types': column_types,
            'preview': df.head(30).to_dict(orient='records'),
            'chart_suggestions': suggestions,
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

# Route to handle user queries
@app.route('/query', methods=['POST'])
def handle_query():
    global df
    if df is None:
        return jsonify({"error": "No dataset uploaded. Please upload a CSV file first."}), 400

    query = request.json.get('query')
    if not query:
        return jsonify({"error": "Query is required."}), 400

    # Convert dataset to string for Gemini input
    data_str = df.to_string()

    # Form the prompt for Gemini to answer the question
    prompt = f"Answer the following question based on the dataset:\n{data_str}\n\nQuestion: {query}\nAnswer:"

    # Call the Gemini API using the genai library
    try:
        # Specify the model to use
        model = genai.GenerativeModel("gemini-1.5-flash")
        
        # Generate content based on the prompt
        response = model.generate_content(prompt)
        
        # Extract the answer from the response
        answer = response.text.strip()
        return jsonify({"answer": answer})
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500


def parse_ai_response(response_text):
    """
    Parse the AI's response into a structured dictionary for chart suggestions.
    Example AI Response:
    - LineChart: col1, col2
    - BarChart: col3, col4
    - PieChart: , 
    - Scatter Plot: col5, col6
    - Histogram: col7, 
    """
    suggestions = {
        "LineChart": ["", ""],
        "BarChart": ["", ""],
        "PieChart": ["", ""],
        "Scatter Plot": ["", ""],
        "Histogram": ["", ""]
    }

    lines = response_text.strip().split('\n')
    for line in lines:
        parts = line.split(':')
        if len(parts) == 2:
            chart, cols = parts[0].strip(), parts[1].strip()
            if chart in suggestions:
                suggestions[chart] = [col.strip() for col in cols.split(',')]

    return suggestions


if __name__ == '__main__':
    app.run(debug=True)
