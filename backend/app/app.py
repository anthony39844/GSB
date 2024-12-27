from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
import requests


# Load environment variables from .env file
load_dotenv()

# Access environment variables
api_key = os.getenv("API_KEY")
headers = {
    'X-Riot-Token': api_key,
    'Content-Type': 'application/json'
}
summoner_name = "anthony39844"
api_route = "https://api.riotgames.com/lol/status/v4/shard-data"
temp_route= f'https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/{summoner_name}/NA1?api_key={api_key}'
puuid = ""
app = Flask(__name__)
CORS(app)  # Allow cross-origin requests

# Sample API endpoint
def get_matches(puuid1):
    matches_route = f'https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/{puuid1}/ids?start=0&count=20&api_key={api_key}'
    response = requests.get(matches_route, headers=headers).json()
    return response

@app.route('/api/data', methods=['GET'])
def get_data():
    response = requests.get(temp_route, headers=headers).json()
    puuid = response["puuid"]
    matches_route = f'https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/{puuid}/ids?start=0&count=20&api_key={api_key}'
    response = requests.get(matches_route, headers=headers).json()
    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True, port=5000)

