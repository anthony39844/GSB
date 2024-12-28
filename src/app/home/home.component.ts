import { Component } from '@angular/core';
import { ApiService } from '../service/api/api.service';
import { Router } from '@angular/router';
import { PuuidService } from '../service/puuid/puuid.service';  

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  constructor(private apiService: ApiService, private router: Router, private puuidService: PuuidService) {}

  getPuuid(summoner: string) {
    this.apiService.getPuuid(summoner).subscribe(data => {
      if (data['puuid']) {
        this.puuidService.setPuuid(data['puuid']);
        this.router.navigate(['/summoner', summoner]);
      } else {
        console.log("Invalid summoner", data)
      }
    })
  }
}
