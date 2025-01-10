import { Component, Input } from '@angular/core';
import { ItemsService } from '../../service/items/items.service';
import { RunesService } from '../../service/icon/runes.service';
import { SumSpellsService } from '../../service/icon/sum-spells.service';

@Component({
  selector: 'app-hover-tooltip',
  imports: [],
  templateUrl: './hover-tooltip.component.html',
  styleUrl: './hover-tooltip.component.scss',
})
export class HoverTooltipComponent {
  @Input() type: string = '';
  @Input() info: number = 0;
  route: string = '';
  description: string = '';
  name: string = '';
  constructor(
    private itemService: ItemsService,
    private runesService: RunesService,
    private sumSpellService: SumSpellsService
  ) {}
  ngOnInit() {
    if (this.type === 'item' && this.info != 0) {
      const data = this.itemService.getData(`${this.info}`);
      this.description = data.description.replace(/<(?!br\s*\/?)[^>]*>/gi, ''); // Removes all tags except <br>
      this.name = data.name;
      console.log(data.description.replace(/<(?!br\s*\/?)[^>]*>/gi, ''));

      this.route = `https://ddragon.leagueoflegends.com/cdn/15.1.1/img/item/${this.info}.png`;
    } else if (this.type === 'rune') {
      const data = this.runesService.getRunes(this.info);
      this.description = data?.description.replace(/<(?!br\s*\/?)[^>]*>/gi, ''); // Removes all tags except <br>
      this.name = data.name;
      this.route = `https://ddragon.leagueoflegends.com/cdn/img/${data.icon}`;
    } else if (this.type === 'spell') {
      const data = this.sumSpellService.getSums(this.info);
      this.description = data.description.replace(/<(?!br\s*\/?)[^>]*>/gi, ''); // Removes all tags except <br>
      this.name = data.name;
      this.route = `https://ddragon.leagueoflegends.com/cdn/15.1.1/img/spell/${data.icon}`;
    }
  }
}
