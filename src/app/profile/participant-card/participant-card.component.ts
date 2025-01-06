import { Component, Input } from '@angular/core';
import { MatchInfoService } from '../../service/matchInfo/match-info.service';
import { defaultParticipantData, MatchData } from '../../interfaces/matchData.interface';
import { CommonModule } from '@angular/common';
import { PuuidService } from '../../service/puuid/puuid.service';
import { RunesComponent } from "../runes/runes.component";

@Component({
  selector: 'app-participant-card',
  imports: [CommonModule, RunesComponent],
  templateUrl: './participant-card.component.html',
  styleUrl: './participant-card.component.scss',
})
export class ParticipantCardComponent {
  objectEntries = Object.entries;
  Math = Math;
  puuid: string = '';
  matchData: MatchData = {
    dataLoaded: false,
    time: 0,
    gameMode: '',
    gameLength: 1,
    timeAgo: null,
    expanded: false,
    teams: [],
    profile: defaultParticipantData,
  };
  @Input() matchId: string = '';
  @Input() getPuuid!: (param1: string, param2: string) => void;

  constructor(
    private matchInfoService: MatchInfoService,
    private puuidService: PuuidService
  ) {}

  ngOnInit() {
    this.matchData = this.matchInfoService.getMatchData()[this.matchId];
    this.puuid = this.puuidService.getPuuid();
  }

  getMaxDamage(team: number) {
    return Math.max(
      ...this.matchData['teams'][team].members.map(
        (player) => player.damageDealt
      )
    );
  }
}
