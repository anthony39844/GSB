import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../service/api/api.service';
import { firstValueFrom } from 'rxjs';
import { PuuidService } from '../../service/puuid/puuid.service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  constructor(
    private router: Router,
    private apiService: ApiService,
    private puuidService: PuuidService
  ) {}

  async getPuuid(summoner: string, tag: string) {
    tag = tag.replace('#', '');
    tag = tag || 'NA1';

    this.router.navigate(['/summoner', `${summoner}-${tag}`]);
  }

  sendHome() {
    this.router.navigate(['']);
  }
}
