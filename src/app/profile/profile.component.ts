import { Component } from '@angular/core';
import { PuuidService } from '../service/puuid/puuid.service';  
import { ApiService } from '../service/api/api.service';
import { match } from 'assert';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  puuid = ""
  ids = []
  constructor(private apiService: ApiService, private puuidService: PuuidService) {}

  ngOnInit(): void {
    this.puuid = this.puuidService.getPuuid();
    this.apiService.getMatchIds(this.puuid).subscribe(ids => {
    if (ids) {
      this.ids = ids
      console.log(this.ids)
    }
    })
  }

  getMatchData() {
    for (const match_id of this.ids) {
      this.apiService.getMatchData(match_id).subscribe(match_data => {
        if (match_data) {
          console.log(match_data);
        }
      })
    }
  }

  
}
