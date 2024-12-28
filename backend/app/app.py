from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
import requests

app = Flask(__name__)
CORS(app)

load_dotenv()
api_key = os.getenv("API_KEY")
route = "https://americas.api.riotgames.com"

@app.route('/match_ids/<puuid>')
def get_matches(puuid):
    matches_route = f'{route}/lol/match/v5/matches/by-puuid/{puuid}/ids?start=0&count=20&api_key={api_key}'
    response = requests.get(matches_route).json()
    return response

@app.route('/puuid/<summoner>', methods=['GET'])
def get_data(summoner):
    response = requests.get(f"{route}/riot/account/v1/accounts/by-riot-id/{summoner}/NA1?api_key={api_key}").json()
    return jsonify(response)


if __name__ == '__main__':
    app.run(debug=True, port=5000)

