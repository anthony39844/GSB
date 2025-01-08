import { Component, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  MatchData,
  ParticipantData,
  defaultParticipantData,
} from '../interfaces/matchData.interface';
import { MatchInfoService } from '../service/matchInfo/match-info.service';
import { PuuidService } from '../service/puuid/puuid.service';
import { CommonModule } from '@angular/common';
import { RunesService } from '../service/icon/runes.service';
import { SumSpellsService } from '../service/icon/sum-spells.service';
import { ApiService } from '../service/api/api.service';

@Component({
  selector: 'app-match-details',
  imports: [CommonModule],
  templateUrl: './match-details.component.html',
  styleUrl: './match-details.component.scss',
})
export class MatchDetailsComponent {
  matchId: string = '';
  puuid: string = '';
  mostStatPlayers: [ParticipantData, string][] = [];
  statKeyOrder: string[] = ['CSscore', 'damageDealt', 'gold', 'kda'];
  laneImages: string[] = ['top', 'jungle', 'middle', 'bottom', 'support'];
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

  @Input() getPuuid!: (param1: string, param2: string) => void;

  constructor(
    private route: ActivatedRoute,
    private matchInfoService: MatchInfoService,
    private puuidService: PuuidService,
    private router: Router,
    private runeService: RunesService,
    private spellService: SumSpellsService,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      let match = params.get('match-id');
      let summonerTag = params.get('summoner');
      let summoner, tag;
      if (summonerTag) {
        [summoner, tag] = summonerTag.split('-');
        this.setPuuid(summoner, tag);
      }
      if (match) {
        this.matchId = match;
        this.matchData = this.matchInfoService.getMatchData()[this.matchId];

        if (!this.matchData) {
          this.matchInfoService.setIds([match]);
          this.matchInfoService.setPuuid(this.puuidService.getPuuid());
          console.log(this.matchInfoService.getMatchData()[this.matchId]);
          this.matchData = this.matchInfoService.getMatchData()[this.matchId];
        }

        this.puuid = this.puuidService.getPuuid();
        this.mostStats();
      }
    });
  }

  setPuuid(summoner: string, tag: string) {
    this.apiService.getPuuid(summoner, tag).subscribe((data) => {
      if (data['puuid']) {
        this.puuidService.setPuuid(data.puuid);
      }
    });
  }

  getRune(key: number) {
    return this.runeService.getRunes(key).icon;
  }
  getSpell(key: number) {
    return this.spellService.getSums(key).icon;
  }

  mostStats() {
    const findTopPlayer = (teams: any[], scoreType: string) => {
      const allPlayers = teams.flatMap((team) => team.members);
      console.log(teams[0]);
      console.log(teams[0].members);
      const maxScore = Math.max(
        ...allPlayers.map((member) => member[scoreType])
      );

      return allPlayers.find((member) => member[scoreType] === maxScore);
    };

    this.mostStatPlayers.push([
      findTopPlayer(this.matchData.teams, 'CSscore'),
      'CS',
    ]);
    this.mostStatPlayers.push([
      findTopPlayer(this.matchData.teams, 'damageDealt'),
      'DAMAGE',
    ]);
    this.mostStatPlayers.push([
      findTopPlayer(this.matchData.teams, 'gold'),
      'GOLD',
    ]);
    this.mostStatPlayers.push([
      findTopPlayer(this.matchData.teams, 'kda'),
      'KDA',
    ]);
  }

  newNavigate(newSummoner: string, newTag: string) {
    this.router.navigate(['/summoner', `${newSummoner}-${newTag}`]);
  }
}
