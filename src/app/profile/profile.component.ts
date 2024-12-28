import { Component } from '@angular/core';
import { PuuidService } from '../service/puuid/puuid.service';  
import { ApiService } from '../service/api/api.service';

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
    }
    })
  }

  
}
