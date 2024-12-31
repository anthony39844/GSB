import { Component } from '@angular/core';
import { PuuidService } from '../service/puuid/puuid.service';  
import { ApiService } from '../service/api/api.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatchData } from './profile.interface';

@Component({
  selector: 'app-profile',
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})



export class ProfileComponent {
  Math = Math;
  puuid = ""
  ids: MatchData[] = []; 
  loaded = false;
  summoner: string = "";
  tagLine: string = "";
  accountLoaded: boolean = false;

  soloRank: string = "";
  soloLosses: string = "";
  soloWins: string = "";
  soloLP: string = "";
  soloWinPercent: number = 0;
  soloTier: string = "unrank"

  flexRank: string = "";
  flexWins: string = "";
  flexLosses: string = "";
  flexLP: string = "";
  flexWinPercent: number = 0;
  flexTier: string = "unrank"

  queueIDMap: {[key: number]: string} = {
    400: "NORMAL DRAFT",
    420: "RANKED SOLO",
    430: "QUICK PLAY",
    440: "RANKED FLEX",
    450: "ARAM",
    490: "QUICK PLAY"
  }

  sumSpells: any;
  runes: any;

  
  constructor(private apiService: ApiService, private puuidService: PuuidService, private router: Router) {}

  ngOnInit(): void {
    if (this.puuidService.getPuuid() != "") {
      this.puuid = this.puuidService.getPuuid();
      this.getMatchIds();
      this.getAccountData();
      this.getSumSpells();
      this.getRunes();
    }
  }

  getMatchIds() {
    this.apiService.getMatchIds(this.puuid).subscribe(matchIds => {
      if (matchIds) {
        this.ids = matchIds.map((id: string)=> ({
          matchId: id,
          win: true,
          champion: "",
          time: 0,
          gameMode: "",
          dataLoaded: false,
          kills: 0,
          deaths: 0,
          assists: 0,
          items: [],
          lane: "",
          sumSpell1: null,
          sumSpell2: null,
          rune1: null,
          rune2: null
        }));
        this.getMatchData();
      } else {
        console.log("Error getting matchIds")
      }
    })
  }

  getSumSpells() {
    this.apiService.getSummonerSpellData().subscribe(spells => {
      this.sumSpells = spells;
    })
  }

  getRunes() {
    this.apiService.getRunes().subscribe(runes => {
      this.runes = runes;
    })
  }

  getMatchData() {
    for (const match of this.ids) {
      this.apiService.getMatchData(match.matchId).subscribe(matchData => {
        if (matchData) {
          const matchInfo = matchData["info"];
          const participants = matchInfo["participants"];
          const gameStart = matchInfo["gameCreation"];
          const currentParticipant = participants.find(
            (participant: { [key: string]: any }) => participant["puuid"] === this.puuid
          );

          match.win = currentParticipant["win"];
          match.champion = currentParticipant["championName"];
          match.time = gameStart;
          match.dataLoaded = true;
          match.gameMode = this.queueIDMap[matchInfo['queueId']]
          match.kills = currentParticipant["kills"]
          match.deaths = currentParticipant["deaths"]
          match.assists = currentParticipant["assists"]
          match.lane = currentParticipant["teamPosition"]
            
          let rune1 = currentParticipant['perks']['styles'][0]['style']
          let rune2 = currentParticipant['perks']['styles'][1]['style']

          for (let i = 0; i < 7; i++) {
            let curItem = currentParticipant[`item${i}`]
            if (curItem != 0) {
              match.items.push(curItem)
            }
          }

          for (let i in this.sumSpells['data']) {
            if (currentParticipant['summoner1Id'] == this.sumSpells['data'][i]['key']) {
              match.sumSpell1 = this.sumSpells['data'][i]['image']['full']
            }
            if (currentParticipant['summoner2Id'] == this.sumSpells['data'][i]['key']) {
              match.sumSpell2 = this.sumSpells['data'][i]['image']['full']
            }
            if (match.sumSpell1 && match.sumSpell2) {
              break;
            }
          }

          for (let rune of this.runes) {
            if (rune1 == rune['id']) {
              match.rune1 = rune['icon']
            }
            if (rune2 == rune['id']) {
              match.rune2 = rune['icon']
            }
            if (match.rune1 && match.rune2) {
              break;
            }
          }

          this.ids.sort((a, b) => b.time - a.time);
        }
      });
    }
    this.loaded = true;
  }

  allDataLoaded(): boolean {
    return this.ids.every(match => match.dataLoaded);
  }

  getPuuid(summoner: string, tag : string) {
    this.accountLoaded = false;
    this.loaded = false;
    tag = tag.replace("#", "")
    this.apiService.getPuuid(summoner, tag ? tag : "NA1").subscribe(data => {
      if (data['puuid']) {
        this.puuid = data['puuid'];
        this.router.navigate(['/summoner', summoner]);
        this.getMatchIds();
        this.getAccountData();
      } else {
        console.log("Invalid summoner", data)
      }
    })
  }

  getAccountData() {
    this.apiService.getAccountData(this.puuid).subscribe(data => {
      if (data) {
        this.summoner = data['gameName']
        this.tagLine = data['tagLine']
        this.accountLoaded = true;
      }
    })
    this.apiService.getRankData(this.puuid).subscribe(data => {
      if (data) {
        let hasFlex = true
        let hasSolo = true
        let solo = null;
        let flex = null;
        if (data.length == 1) {
          if (data[0]['queueType'] == 'RANKED_FLEX_SR') {
            hasSolo = false
          } else {
            hasFlex = false
          }
        }
        if (hasSolo && hasFlex) {
          flex = data[0]
          solo = data[1]
        } else if (hasFlex) {
          flex = data[0]
        } else if (hasSolo) {
          solo = data[0]
        }

        if (solo) {
          this.soloTier = solo['tier']
          this.soloRank = this.soloTier + " " + solo["rank"]
          this.soloLosses = solo['losses']
          this.soloWins = solo['wins']
          this.soloLP = solo['leaguePoints']
          this.soloWinPercent = +Number(parseFloat(this.soloWins) / (parseFloat(this.soloWins) + parseFloat(this.soloLosses)) * 100).toFixed(1) 
        }
        if (flex) {
          this.flexTier = flex['tier']
          this.flexRank = this.flexTier + " " + flex["rank"]
          this.flexLosses = flex['losses']
          this.flexWins = flex['wins']
          this.flexLP = flex['leaguePoints']
          this.flexWinPercent = +Number(parseFloat(this.flexWins) / (parseFloat(this.flexWins) + parseFloat(this.flexLosses)) * 100).toFixed(1)
        }
      }
    })
  }

  sendHome() {
    this.router.navigate(['']);
  }
}
