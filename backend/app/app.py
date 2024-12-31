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
ddragon_route = "https://ddragon.leagueoflegends.com/cdn/14.24.1/data/en_US"

@app.route('/match_ids/<puuid>')
def get_matches(puuid):
    matches_route = f'{route}/lol/match/v5/matches/by-puuid/{puuid}/ids?start=0&count=10&api_key={api_key}'
    response = requests.get(matches_route).json()
    return response

@app.route('/puuid/<summoner>/<tag>', methods=['GET'])
def get_puuid(summoner, tag):
    response = requests.get(f"{route}/riot/account/v1/accounts/by-riot-id/{summoner}/{tag}?api_key={api_key}").json()
    return jsonify(response)

@app.route('/get_matches/<match_id>', methods=['GET'])
def get_match_info(match_id):
    response = requests.get(f"{route}/lol/match/v5/matches/{match_id}?api_key={api_key}").json()
    return jsonify(response)

@app.route('/get_account/<puuid>', methods=['GET'])
def get_account_info(puuid):
    response = requests.get(f"{route}/riot/account/v1/accounts/by-puuid/{puuid}?api_key={api_key}").json()
    return jsonify(response)

@app.route('/get_rank/<puuid>', methods=["GET"])
def get_rank(puuid):
    summoner_id = requests.get(f"https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/{puuid}?api_key={api_key}").json()['id']
    response = requests.get(f"https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/{summoner_id}?api_key={api_key}").json()

    return jsonify(response)

@app.route('/get_sum_spells', methods=["GET"])
def get_sum_spells():
    return jsonify(requests.get(f"{ddragon_route}/summoner.json").json())

@app.route('/get_runes', methods=["GET"])
def get_runes():
    return jsonify(requests.get(f"{ddragon_route}/runesReforged.json").json())


if __name__ == '__main__':
    app.run(debug=True, port=5000)

