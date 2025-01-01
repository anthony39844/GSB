import { Injectable } from '@angular/core';
import { MatchData, ParticipantData } from '../../interfaces/matchData.interface';
import { ApiService } from '../api/api.service';
import { RunesService } from '../icon/runes.service';
import { SumSpellsService } from '../icon/sum-spells.service';

@Injectable({
  providedIn: 'root'
})
export class MatchInfoService {
  ids: [] = [];
  puuid: string = "";
  matchData: {[key: string]: MatchData} = {}; 
  queueIDMap: {[key: number]: string} = {
    400: "NORMAL DRAFT",
    420: "RANKED SOLO",
    430: "QUICK PLAY",
    440: "RANKED FLEX",
    450: "ARAM",
    490: "QUICK PLAY"
  }

  constructor(private apiService: ApiService, private runesService : RunesService, private sumsService : SumSpellsService) { }

  setIds(ids: []) {
    this.ids = ids;
    this.setData();
  }

  setPuuid(puuid: string) {
    this.puuid = puuid;
  }

  private setData() {
    for (let matchId in this.ids) {
      this.matchData[this.ids[matchId]] = {
        dataLoaded: false,
        time: 0,
        gameMode: "",
        gameLength: 1,
        timeAgo: null,
        expanded: false,
        participants: [],
        profile: {
          profilePlayer: false,
          gameName: "",
          win: true,
          champion: "",
          kills: 0,
          deaths: 0,
          assists: 0,
          items: [],
          lane: "",
          sumSpell1: null,
          sumSpell2: null,
          rune1: null,
          rune2: null,
          CSscore: 0,
          csPerMin: 0
        }
      }
    }
    for (const matchId in this.matchData) {
      let match = this.matchData[matchId]
      this.apiService.getMatchData(matchId).subscribe(matchData => {
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
          match.expanded = false;

          for (const participant of participants) {
            match.gameLength = Math.floor(participant['timePlayed'] / 60)

            let rune1 = participant['perks']['styles'][0]['selections'][0]['perk']
            let rune2 = participant['perks']['styles'][1]['style']

            const cs = participant["totalMinionsKilled"] + participant['neutralMinionsKilled']
            const currentParticipant: ParticipantData = {
              gameName: participant.riotIdGameName,
              profilePlayer: participant.puuid === this.puuid,
              win: participant.win,
              champion: participant.championName,
              kills: participant.kills,
              deaths: participant.deaths,
              assists: participant.assists,
              lane: match.gameMode !== "ARAM" ? participant.individualPosition === "UTILITY" ? "SUPPORT" : participant.individualPosition : "",
              rune1: this.runesService.getRunes(rune1),
              rune2: this.runesService.getRunes(rune2),
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
          
            match.dataLoaded = true;
            this.matchData =  Object.fromEntries(
              Object.entries(this.matchData).sort(([, valueA], [, valueB]) => valueB.time - valueA.time)
            );
          }
        }
      });
    }
  
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


  getMatchData() {
    return this.matchData;
  }
}
