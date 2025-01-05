import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatchData, ParticipantData, defaultParticipantData } from '../interfaces/matchData.interface';
import { MatchInfoService } from '../service/matchInfo/match-info.service';
import { PuuidService } from '../service/puuid/puuid.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-match-details',
  imports: [CommonModule],
  templateUrl: './match-details.component.html',
  styleUrl: './match-details.component.scss'
})
export class MatchDetailsComponent {
  matchId: string = ""
  puuid: string = ""
  mostCsPlayer: ParticipantData = defaultParticipantData;
  mostKdaPlayer: ParticipantData = defaultParticipantData;
  mostDamagePlayer: ParticipantData = defaultParticipantData;
  mostGoldPlayer: ParticipantData = defaultParticipantData;
  matchData: MatchData = {
    dataLoaded: false,
    time: 0,
    gameMode: '',
    gameLength: 1,
    timeAgo: null,
    expanded: false,
    teams: [],
    profile: {
      puuid: "",
      profilePlayer: false,
      gameName: '',
      win: true,
      champion: '',
      kills: 0,
      deaths: 0,
      assists: 0,
      kda: 0,
      items: [],
      lane: '',
      sumSpell1: null,
      sumSpell2: null,
      rune1: null,
      rune2: null,
      CSscore: 0,
      csPerMin: 0,
      Kp: 0,
      damageDealt: 0,
      magicDamage: 0,
      physicalDamage: 0,
      trueDamage: 0,
      damageOrder: [],
      level: 0,
      wardsPlaced: 0,
      wardsCleared: 0,
      RedWardsPlace: 0,
      gold: 0,
      tagLine: ""
    }
  }

  constructor(private route: ActivatedRoute, private matchInfoService : MatchInfoService, private puuidService : PuuidService) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      let match = params.get('match-id');
      if (match) {
        this.matchId = match;
        this.matchData = this.matchInfoService.getMatchData()[this.matchId];
        this.puuid = this.puuidService.getPuuid()
        this.mostStats()
      }
    });
  }

  mostStats() {
    const findTopPlayer = (teams: any[], scoreType: string) => {
      const allPlayers = teams.flatMap(team => team.members);
      const maxScore = Math.max(...allPlayers.map(member => member[scoreType]));
    
      return allPlayers.find(member => member[scoreType] === maxScore);
    };
    
    this.mostGoldPlayer = findTopPlayer(this.matchData.teams, 'gold');
    this.mostCsPlayer = findTopPlayer(this.matchData.teams, 'CSscore');
    this.mostKdaPlayer = findTopPlayer(this.matchData.teams, 'kda');
    this.mostDamagePlayer = findTopPlayer(this.matchData.teams, 'damageDealt');
  }

}

