import { Component } from '@angular/core';
import { PuuidService } from '../service/puuid/puuid.service';  
import { ApiService } from '../service/api/api.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

interface MatchData {
  win: boolean;
  champion: string;
  time: number;
}

@Component({
  selector: 'app-profile',
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})

export class ProfileComponent {
  puuid = ""
  ids: { matchId: string; win: boolean; champion: string; time: number; dataLoaded: boolean }[] = []; 
  loaded = false;
  summoner: string = "";
  tagLine: string = "";
  accountLoaded: boolean = false;

  constructor(private apiService: ApiService, private puuidService: PuuidService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.puuid = this.puuidService.getPuuid();
    this.getMatchIds();
    this.getAccountData();
  }

  getMatchIds() {
    this.apiService.getMatchIds(this.puuid).subscribe(matchIds => {
      if (matchIds) {
        this.ids = matchIds.map((id: string)=> ({
          matchId: id,
          win: true,
          champion: "",
          time: 0,
          dataLoaded: false
        }));

        this.getMatchData();

      } else {
        console.log("Error getting matchIds")
      }
    })
  }

  getMatchData() {
    for (const match of this.ids) {
      this.apiService.getMatchData(match.matchId).subscribe(matchData => {
        if (matchData) {
          const matchInfo = matchData["info"];
          const participants = matchInfo["participants"];
          const teams = matchInfo["teams"];
          const team1 = teams[0]["teamId"];
          const team1win = teams[0]["win"];
          const gameStart = matchInfo["gameCreation"];
          const currentParticipant = participants.find(
            (participant: { [key: string]: any }) => participant["puuid"] === this.puuid
          );
          const participantTeam = currentParticipant?.["teamId"];

          match.win = (team1win && participantTeam === team1) || (!team1win && participantTeam !== team1);
          match.champion = currentParticipant["championName"];
          match.time = gameStart;
          match.dataLoaded = true;

          this.ids.sort((a, b) => b.time - a.time);
        }
      });
    }
    this.loaded = true;
  }

  allDataLoaded(): boolean {
    return this.ids.every(match => match.dataLoaded);
  }

  getPuuid(summoner: string) {
    this.accountLoaded = false;
    this.apiService.getPuuid(summoner).subscribe(data => {
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
      this.summoner = data['gameName']
      this.tagLine = data['tagLine']
      this.accountLoaded = true;
    })
  }
}
