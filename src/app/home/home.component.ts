import { Component } from '@angular/core';
import { ApiService } from '../service/api/api.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  backgroundUrl: string = '';
  championsList: string[] = [];

  constructor(private router: Router, private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getChamps().subscribe((champs) => {
      this.championsList = Object.keys(champs.data);
    });
    if (this.championsList.length > 0) {
      const randomNum = Math.floor(Math.random() * this.championsList.length);
      this.backgroundUrl = `url(https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${this.championsList[randomNum]}_0.jpg)`;
    }
  }

  getPuuid(summoner: string, tag: string) {
    tag = tag.replace('#', '');
    tag = tag ? tag : 'NA1';
    this.router.navigate(['/summoner', `${summoner}-${tag}`]);
  }
}
