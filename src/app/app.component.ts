import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SumSpellsService } from './service/icon/sum-spells.service';
import { RunesService } from './service/icon/runes.service';
import { ApiService } from './service/api/api.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor(
    private sumService: SumSpellsService,
    private runeService: RunesService,
    private apiService: ApiService
  ) {}
  ngOnInit(): void {
    this.apiService.getRunes().subscribe((runes) => {
      for (let rune_page of runes) {
        this.runeService.setRunes(rune_page['id'], {
          icon: rune_page['icon'],
          description: '',
          name: rune_page.name,
        });
        for (let slot of rune_page['slots']) {
          for (let runeFam in slot) {
            const curRuneFam = slot[runeFam];
            for (let rune of curRuneFam) {
              this.runeService.setRunes(rune['id'], {
                icon: rune['icon'],
                description: rune.shortDesc,
                name: rune.name,
              });
            }
          }
        }
      }
    });
    this.apiService.getSummonerSpellData().subscribe((spellData) => {
      const data = spellData['data'];
      for (let spell in data) {
        const curSpell = data[spell];
        this.sumService.setSums(curSpell['key'], {
          icon: curSpell['image']['full'],
          description: curSpell.description,
          name: curSpell.id.substring(8),
        });
      }
    });
  }
}
