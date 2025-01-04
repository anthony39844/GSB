import { Component } from '@angular/core';
import { PuuidService } from '../service/puuid/puuid.service';
import { ApiService } from '../service/api/api.service';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MatchData } from '../interfaces/matchData.interface';
import { ParticipantCardComponent } from './participant-card/participant-card.component';
import { MatchInfoService } from '../service/matchInfo/match-info.service';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, ParticipantCardComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  objectEntries = Object.entries;
  Math = Math;
  puuid = '';
  matchData: { [key: string]: MatchData } = {};
  loaded = false;
  summoner: string = '';
  tagLine: string = '';
  accountLoaded: boolean = false;

  soloRank: string = '';
  soloLosses: string = '';
  soloWins: string = '';
  soloLP: string = '';
  soloWinPercent: number = 0;
  soloTier: string = 'unrank';

  flexRank: string = '';
  flexWins: string = '';
  flexLosses: string = '';
  flexLP: string = '';
  flexWinPercent: number = 0;
  flexTier: string = 'unrank';
  laneImages: string[] = ['top', 'jungle', 'middle', 'bottom', 'support'];

  constructor(
    private apiService: ApiService,
    private puuidService: PuuidService,
    private router: Router,
    private matchInfoService: MatchInfoService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      let summonerTag = params.get('summoner');
      if (summonerTag) {
        let [summoner, tag] = summonerTag.split('-');
        this.getPuuid(summoner, tag);
      }
    });
  }

  getMatchIds() {
    this.apiService.getMatchIds(this.puuid).subscribe((matchIds) => {
      if (matchIds) {
        this.matchInfoService.setPuuid(this.puuid);
        this.matchInfoService.setIds(matchIds);
      } else {
        console.log('Error getting matchIds');
      }
    });
  }

  toggleExpand(matchId: string) {
    this.matchData[matchId].expanded = !this.matchData[matchId].expanded;
  }

  getPuuid(summoner: string, tag: string) {
    this.reset();
    tag = tag.replace('#', '');
    tag = tag ? tag : 'NA1';
    this.apiService.getPuuid(summoner, tag ? tag : 'NA1').subscribe((data) => {
      if (data['puuid']) {
        this.puuid = data['puuid'];
        this.puuidService.setPuuid(this.puuid);
        this.router.navigate(['/summoner', `${summoner}-${tag}`]);
        this.getMatchIds();
        this.getAccountData();
        this.summoner = data['gameName'];
        this.tagLine = data['tagLine'];
        this.matchData = this.matchInfoService.getMatchData();
      } 
      // else {
      //   if (data['status']['status_code'] == 429) {
      //     console.log('RATE');
      //     setTimeout(() => {}, 5000);
      //     // this.getPuuid(summoner, tag);
      //   } else {
      //     console.log('Invalid summoner', data);
      //   }
      // }
    });
  }

  allDataLoaded(): boolean {
    return Object.values(this.matchData).every((match) => match.dataLoaded);
  }

  getAccountData() {
    this.accountLoaded = true;
    this.apiService.getRankData(this.puuid).subscribe((data) => {
      if (data) {
        let hasFlex = true;
        let hasSolo = true;
        let solo = null;
        let flex = null;
        if (data.length == 1) {
          if (data[0]['queueType'] == 'RANKED_FLEX_SR') {
            hasSolo = false;
          } else {
            hasFlex = false;
          }
        }
        if (hasSolo && hasFlex) {
          solo = data[1];
          flex = data[0];
        } else if (hasFlex) {
          flex = data[0];
        } else if (hasSolo) {
          solo = data[1];
        }

        if (solo) {
          this.soloTier = solo['tier'];
          this.soloRank = this.soloTier + ' ' + solo['rank'];
          this.soloLosses = solo['losses'];
          this.soloWins = solo['wins'];
          this.soloLP = solo['leaguePoints'];
          this.soloWinPercent = +Number(
            (parseFloat(this.soloWins) /
              (parseFloat(this.soloWins) + parseFloat(this.soloLosses))) *
              100
          ).toFixed(1);
        }
        if (flex) {
          this.flexTier = flex['tier'];
          this.flexRank = this.flexTier + ' ' + flex['rank'];
          this.flexLosses = flex['losses'];
          this.flexWins = flex['wins'];
          this.flexLP = flex['leaguePoints'];
          this.flexWinPercent = +Number(
            (parseFloat(this.flexWins) /
              (parseFloat(this.flexWins) + parseFloat(this.flexLosses))) *
              100
          ).toFixed(1);
        }
      }
    });
  }

  sendHome() {
    this.router.navigate(['']);
  }

  reset() {
    this.puuid = '';
    this.matchData = {};
    this.loaded = false;
    this.summoner = '';
    this.tagLine = '';
    this.accountLoaded = false;
    this.soloRank = '';
    this.soloLosses = '';
    this.soloWins = '';
    this.soloLP = '';
    this.soloWinPercent = 0;
    this.soloTier = 'unrank';
    this.flexRank = '';
    this.flexWins = '';
    this.flexLosses = '';
    this.flexLP = '';
    this.flexWinPercent = 0;
    this.flexTier = 'unrank';
    console.log(this.matchData);
  }
}
