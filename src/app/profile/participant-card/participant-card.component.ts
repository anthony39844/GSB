import { Component, Input } from '@angular/core';
import { MatchInfoService } from '../../service/matchInfo/match-info.service';
import { MatchData } from '../../interfaces/matchData.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-participant-card',
  imports: [CommonModule],
  templateUrl: './participant-card.component.html',
  styleUrl: './participant-card.component.scss'
})

export class ParticipantCardComponent {
  objectEntries = Object.entries;
  Math = Math;
  puuid: string = ""
  matchData: MatchData = {
    dataLoaded: false,
    time: 0,
    gameMode: "",
    gameLength: 1,
    timeAgo: null,
    expanded: false,
    teams: [],
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
      csPerMin: 0,
    }
  }
  @Input() matchId: string = "";

  constructor(private matchInfoService : MatchInfoService) {
    
  };

  ngOnInit(){
    this.matchData = this.matchInfoService.getMatchData()[this.matchId];
  }
}
