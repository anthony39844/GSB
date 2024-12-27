from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests

# Sample API endpoint
@app.route('/api/data', methods=['GET'])
def get_data():
    return jsonify({"message": "Hello from the Python backend!"})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
