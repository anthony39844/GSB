import { Component, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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
  mostStatPlayers: [ParticipantData, string][] = [];
  statKeyOrder: string[] = ['CSscore', 'damageDealt', 'gold', 'kda']
  laneImages: string[] = ['top', 'jungle', 'middle', 'bottom', 'support'];
  matchData: MatchData = {
    dataLoaded: false,
    time: 0,
    gameMode: '',
    gameLength: 1,
    timeAgo: null,
    expanded: false,
    teams: [],
    profile: defaultParticipantData
  }

  @Input() getPuuid!: (param1: string, param2: string) => void;

  constructor(private route: ActivatedRoute, private matchInfoService : MatchInfoService, private puuidService : PuuidService, private router: Router,) {}

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
    
    this.mostStatPlayers.push([findTopPlayer(this.matchData.teams, 'CSscore'), 'CS']);
    this.mostStatPlayers.push([findTopPlayer(this.matchData.teams, 'damageDealt'), 'DAMAGE']);
    this.mostStatPlayers.push([findTopPlayer(this.matchData.teams, 'gold'), 'GOLD']);
    this.mostStatPlayers.push([findTopPlayer(this.matchData.teams, 'kda'), 'KDA']);
  }

  newNavigate(newSummoner: string, newTag: string) {
    console.log("nav")
    this.router.navigate(['/summoner', `${newSummoner}-${newTag}`]);
  }
}

