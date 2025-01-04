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
  getPuuid(summoner: string, tag: string) {
    tag = tag.replace("#", "");
    tag =  tag ? tag : "NA1"
    this.router.navigate(['/summoner', `${summoner}-${tag}`]);
  }
}
