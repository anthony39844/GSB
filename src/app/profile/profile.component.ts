import { Component } from '@angular/core';
import { PuuidService } from '../service/puuid/puuid.service';  
import { ApiService } from '../service/api/api.service';
import { match } from 'assert';
import { CommonModule } from '@angular/common';
interface MatchData {
  win: boolean;
  champion: string;
  time: number; // Assuming `time` is a long (number)
}
@Component({
  selector: 'app-profile',
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  puuid = ""
  ids: { [key: string]: MatchData } =  {};  
  constructor(private apiService: ApiService, private puuidService: PuuidService) {}

  ngOnInit(): void {
    this.puuid = this.puuidService.getPuuid();
    this.apiService.getMatchIds(this.puuid).subscribe(matchIds => {
    if (matchIds) {
      for (const id of matchIds) {
        this.ids[`${id}`] = {win: true, champion: "", time:0};
      }
    }
    })
  }

  getMatchData() {
    for (const matchId in this.ids) {
      this.apiService.getMatchData(matchId).subscribe(matchData => {
        if (matchData) {
          // info--> teams-->teamId
          // info--> teams-->win
          // info --> participants-->puuid
          // info --> participants-->teamId
          const matchInfo = matchData["info"]
          const participants = matchInfo["participants"]
          const teams = matchInfo["teams"]
          const team1 = teams[0]["teamId"]
          const team1win = teams[0]["win"]
          // console.log(team1)
          const gameStart = matchInfo["gameCreation"]
          const currentParticipant = participants.find(
            (participant: { [key: string]: any }) => participant["puuid"] === this.puuid
          )
          const participantTeam = currentParticipant?.["teamId"];   
          
          this.ids[matchId] = {
            win: (team1win && participantTeam == team1) || (!team1win && participantTeam !== team1), 
            champion: currentParticipant["championName"],
            time: gameStart,
          }
          const sortedEntries = Object.entries(this.ids).sort(([, valueA], [, valueB]) => {
            return valueB.time - valueA.time; // Compare the `time` property numerically
          });
          
          // Convert back to a dictionary if needed
          const sortedIds = Object.fromEntries(sortedEntries);
          this.ids = sortedIds

        }
      })
    }
  }

  
}
