import { Component } from '@angular/core';
import { ApiService } from '../service/api/api.service';
import { Router } from '@angular/router';
import { PuuidService } from '../service/puuid/puuid.service';  
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  backgroundUrl: string = 'url(https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Kaisa_0.jpg)';


  constructor(private apiService: ApiService, private router: Router, private puuidService: PuuidService) {}

  getPuuid(summoner: string, tag: string) {
    tag = tag.replace("#", "");
    tag =  tag ? tag : "NA1"
    this.apiService.getPuuid(summoner, tag).subscribe(data => {
      if (data['puuid']) {
        this.puuidService.setPuuid(data['puuid']);
        this.router.navigate(['/summoner', `${summoner}-${tag}`]);
      } else {
        console.log("Invalid summoner", data)
      }
    })
  }
}
