import { Component } from '@angular/core';
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
  matchData: {[key: string]: MatchData} = {};

  constructor(private matchInfoService : MatchInfoService) {};

  ngOnInit(){
    this.matchData = this.matchInfoService.getMatchData();
  }
}
