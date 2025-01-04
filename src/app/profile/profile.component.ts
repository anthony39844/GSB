import { Component } from '@angular/core';
import { PuuidService } from '../service/puuid/puuid.service';  
import { ApiService } from '../service/api/api.service';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MatchData } from '../interfaces/matchData.interface';
import { ParticipantCardComponent } from './participant-card/participant-card.component';
import { MatchInfoService } from '../service/matchInfo/match-info.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, ParticipantCardComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})

export class ProfileComponent {
  objectEntries = Object.entries;
  Math = Math;
  puuid = ""
  matchData: {[key: string]: MatchData} = {}; 
  loaded = false;
  summoner: string = "";
  tagLine: string = "";
  profileIcon: number = 0;
  profileLevel: string = "";
  accountLoaded: boolean = false;

  hasSolo: boolean = true;
  soloRank: string = "";
  soloLosses: string = "";
  soloWins: string = "";
  soloLP: string = "";
  soloWinPercent: number = 0;
  soloTier: string = "unrank"

  hasFlex: boolean = true;
  flexRank: string = "";
  flexWins: string = "";
  flexLosses: string = "";
  flexLP: string = "";
  flexWinPercent: number = 0;
  flexTier: string = "unrank"
  laneImages: string[] = [
    'top',
    'jungle',
    'middle',
    'bottom',
    'support',
  ]

  
  constructor(private apiService: ApiService, private puuidService: PuuidService, private router: Router, private matchInfoService : MatchInfoService, private route: ActivatedRoute) {}

  
  ngOnInit(): void {
    const summonerTag = this.route.snapshot.paramMap.get('summoner');
    if (summonerTag) {
      let [summoner, tag] = summonerTag.split('-');
      this.getPuuid(summoner, tag)
    }
    if (this.puuidService.getPuuid() != "") {
      this.puuid = this.puuidService.getPuuid();
    }
  }

  getMatchIds() {
    this.apiService.getMatchIds(this.puuid).subscribe(matchIds => {
      if (matchIds) {
        this.matchInfoService.setPuuid(this.puuid)
        this.matchInfoService.setIds(matchIds)
      } else {
        console.log("Error getting matchIds")
      }
    })
  }

  toggleExpand(matchId: string) {
    this.matchData[matchId].expanded = !this.matchData[matchId].expanded
  }

  async getPuuid(summoner: string, tag : string) {
    this.resetDataLoaded();
    this.reset();
    tag = tag.replace("#", "")
    tag = tag ? tag : "NA1"
    try {
      const data = await firstValueFrom(
        this.apiService.getPuuid(summoner, tag || 'NA1')
      );
      if (data['puuid']) {
        this.puuid = data['puuid'];
        this.puuidService.setPuuid(this.puuid);
        this.router.navigate(['/summoner', `${summoner}-${tag}`]);
        this.getMatchIds();
        await this.getAccountData();
        this.accountLoaded = true;
        this.summoner = data['gameName'];
        this.tagLine = data['tagLine'];
        this.matchData = this.matchInfoService.getMatchData();
      } else {
        console.log('Invalid summoner', data);
      }
    } catch (error) {
      console.error('Error fetching PUUID:', error);
    }
  }

  allDataLoaded(): boolean {
    return Object.values(this.matchData).every(match => match.dataLoaded);
  }

  resetDataLoaded(): void {
    Object.values(this.matchData).forEach(match => {
      match.dataLoaded = false;
    });
  }

  async getAccountData() {
    try {
      const data = await firstValueFrom(this.apiService.getRankData(this.puuid));
      if (data) {
        console.log(data)
        this.hasFlex = true
        this.hasSolo = true
        let solo = null;
        let flex = null;
        if (data.rank.length == 1) {
          if (data.rank[0]['queueType'] == 'RANKED_FLEX_SR') {
            this.hasSolo = false
          } else {
            this.hasFlex = false
          }
        }
        if (this.hasSolo && this.hasFlex) {
          solo = data.rank[1]
          flex = data.rank[0]
        } else if (this.hasFlex) {
          flex = data.rank[0]
        } else if (this.hasSolo) {
          solo = data.rank[0]
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

        this.profileIcon = data.summoner.profileIconId;
        this.profileLevel = data.summoner.summonerLevel
      }
    } catch (error) {
      console.error('Error fetching rank data:', error);
    }
  }

  sendHome() {
    this.router.navigate(['']);
  }
  
  reset() {
    this.puuid = ""
    this.matchData = {}; 
    this.loaded = false;
    this.summoner = "";
    this.tagLine = "";
    this.accountLoaded = false;
    this.soloRank = "";
    this.soloLosses = "";
    this.soloWins = "";
    this.soloLP = "";
    this.soloWinPercent = 0;
    this.soloTier = "unrank"
    this.flexRank = "";
    this.flexWins = "";
    this.flexLosses = "";
    this.flexLP = "";
    this.flexWinPercent = 0;
    this.flexTier = "unrank";
  }
}
