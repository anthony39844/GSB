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
ddragon_route = "https://ddragon.leagueoflegends.com/cdn/15.1.1/data/en_US"

@app.route('/match_ids/<puuid>/<start>')
def get_matches(puuid, start):
    matches_route = f'{route}/lol/match/v5/matches/by-puuid/{puuid}/ids?start={start}&count=4&api_key={api_key}'
    print(matches_route)
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

@app.route('/get_rank/<puuid>', methods=["GET"])
def get_rank(puuid):
    summoner = requests.get(f"https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/{puuid}?api_key={api_key}").json()
    rank = requests.get(f"https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/{summoner['id']}?api_key={api_key}").json()
    return {
        'summoner': summoner,
        'rank': rank
    }

@app.route('/get_sum_spells', methods=["GET"])
def get_sum_spells():
    return jsonify(requests.get(f"{ddragon_route}/summoner.json").json())

@app.route('/get_runes', methods=["GET"])
def get_runes():
    return jsonify(requests.get(f"{ddragon_route}/runesReforged.json").json())

@app.route('/get_champs', methods=["GET"])
def get_champs():
    return jsonify(requests.get(f"{ddragon_route}/champion.json").json())

@app.route('/get_items', methods=["GET"])
def get_items():
    return jsonify(requests.get(f"{ddragon_route}/item.json").json())


if __name__ == '__main__':
    app.run(debug=True, port=5000)

