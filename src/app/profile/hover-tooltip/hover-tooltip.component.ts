import { Component, Input } from '@angular/core';
import { ItemsService } from '../../service/items/items.service';
import { RunesService } from '../../service/icon/runes.service';

@Component({
  selector: 'app-hover-tooltip',
  imports: [],
  templateUrl: './hover-tooltip.component.html',
  styleUrl: './hover-tooltip.component.scss',
})
export class HoverTooltipComponent {
  @Input() type: string = '';
  @Input() info: number = 0;
  displayContent: string = '';
  constructor(private itemService: ItemsService, private runesService: RunesService) {}
  ngOnInit() {
    let description;
    let route;
    let name;
    console.log(this.info);

    if (this.type === 'item') {
      const data = this.itemService.getData(`${this.info}`);
      description = data.description;
      name = data.name;
      route = `https://ddragon.leagueoflegends.com/cdn/14.24.1/img/item/${this.info}.png`;
    } else if (this.type === 'rune') {
      const data = this.runesService.getRunes(this.info);
      description = data.description
      name = data.name;
      route = `https://ddragon.leagueoflegends.com/cdn/img/${data.icon}`;
    }
    this.displayContent = `<img src =${route}><p>${name}</p><div>${description}</div>`;
  }
}
