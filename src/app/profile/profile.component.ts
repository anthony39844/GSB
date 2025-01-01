import { Component } from '@angular/core';
import { PuuidService } from '../service/puuid/puuid.service';  
import { ApiService } from '../service/api/api.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatchData, ParticipantData } from './profile.interface';
import { RunesService } from '../service/icon/runes.service';
import { SumSpellsService } from '../service/icon/sum-spells.service';

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

  
  constructor(private apiService: ApiService, private puuidService: PuuidService, private router: Router, private runesService : RunesService, private sumsService : SumSpellsService) {}

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
          rune1Child1: null,
          rune1Child2: null,
          rune1Child3: null,
          rune2: null,
          rune2Child1: null,
          rune2Child2: null,
          CSscore: 0,
          gameLength: 1,
          csPerMinute: 0,
          timeAgo: null,
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
          match.participants = []
          const matchInfo = matchData["info"];
          const participants = matchInfo["participants"];
          const gameStart = matchInfo["gameCreation"];
          const currTime = Date.now();
          const hoursAgo = Math.floor((currTime - gameStart) / 3600000)
          match.timeAgo = this.getTimeFromHours(hoursAgo)
          match.time = gameStart;
          match.gameMode = this.queueIDMap[matchInfo['queueId']]

          for (const participant of participants) {
            match.gameLength = Math.floor(participant['timePlayed'] / 60)

            let rune1 = participant['perks']['styles'][0]['selections'][0]['perk']
            let rune1Child1 = participant['perks']['styles'][0]['selections'][1]['perk']
            let rune1Child2 = participant['perks']['styles'][0]['selections'][2]['perk']
            let rune1Child3 = participant['perks']['styles'][0]['selections'][3]['perk']
            let rune2 = participant['perks']['styles'][1]['style']
            let rune2Child1 = participant['perks']['styles'][1]['selections'][0]['perk']
            let rune2Child2 = participant['perks']['styles'][1]['selections'][1]['perk']

            const cs = participant["totalMinionsKilled"] + participant['neutralMinionsKilled']
            const currentParticipant: ParticipantData = {
              profilePlayer: participant.puuid === this.puuid,
              win: participant.win,
              champion: participant.championName,
              kills: participant.kills,
              deaths: participant.deaths,
              assists: participant.assists,
              lane: match.gameMode !== "ARAM" ? participant.individualPosition === "UTILITY" ? "SUPPORT" : participant.individualPosition : "",
              rune1: this.runesService.getRunes(rune1),
              // rune1Child1: this.runesService.getRunes(rune1Child1),
              // rune1Child2: this.runesService.getRunes(rune1Child2),
              // rune1Child3: this.runesService.getRunes(rune1Child3),
              rune2: this.runesService.getRunes(rune2),
              // rune2Child1: this.runesService.getRunes(rune2Child1),
              // rune2Child2: this.runesService.getRunes(rune2Child2),
              items: Array.from({ length: 7 }, (_, i) => participant[`item${i}`]).filter(curItem => curItem !== 0),
              sumSpell1: this.sumsService.getSums(participant["summoner1Id"]),
              sumSpell2: this.sumsService.getSums(participant["summoner2Id"]),
              CSscore: cs,
              csPerMin: Math.floor((cs / match.gameLength) * 10) / 10,
            };
            if (participant.puuid === this.puuid) {
              match.profile = currentParticipant;
            }
            match.participants.push(currentParticipant)


          // let rune1style = currentParticipant['perks']['styles'][0]['style']
          // let rune1 = currentParticipant['perks']['styles'][0]['selections'][0]['perk']
          // let rune2 = currentParticipant['perks']['styles'][1]['style']

          // for (let i in this.sumSpells['data']) {
          //   if (currentParticipant['summoner1Id'] == this.sumSpells['data'][i]['key']) {
          //     match.sumSpell1 = this.sumSpells['data'][i]['image']['full']
          //   }
          //   if (currentParticipant['summoner2Id'] == this.sumSpells['data'][i]['key']) {
          //     match.sumSpell2 = this.sumSpells['data'][i]['image']['full']
          //   }
          //   if (match.sumSpell1 && match.sumSpell2) {
          //     break;
          //   }
          // }

          // const primaryRune = this.runes.find((rune: any) => rune1style === rune.id);
          // if (primaryRune) {
          //   const subRune = primaryRune.slots?.[0].runes.find((subrune: any) => rune1 === subrune.id);
          //   if (subRune) {
          //     match.rune1 = subRune.icon;
          //   }
          // }
          // const secondaryRune = this.runes.find((rune: any) => rune2 === rune.id);
          // if (secondaryRune) {
          //   match.rune2 = secondaryRune.icon;
          // }
          
          match.dataLoaded = true;
          this.ids.sort((a, b) => b.time - a.time);
        }
      }});
    }
    
    this.loaded = true;
  }

  getTimeFromHours(hours: number): string {
    if (hours < 1) {
      const minutes = Math.floor(hours * 60); 
      return `${minutes}m ago`; 
    }
    const days = Math.floor(hours / 24); 
    if (days === 0) {
      return `${hours}h ago`;  
    }
    return `${days}d ago`;  
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
