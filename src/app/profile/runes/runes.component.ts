import { Component, Input } from '@angular/core';
import { HoverTooltipComponent } from '../hover-tooltip/hover-tooltip.component';
import { RunesService } from '../../service/icon/runes.service';

@Component({
  selector: 'app-runes',
  imports: [HoverTooltipComponent],
  templateUrl: './runes.component.html',
  styleUrl: './runes.component.scss',
})
export class RunesComponent {
  constructor(private runesService: RunesService) {}
  @Input() rune1: number = 0;
  @Input() rune2: number = 0;
  rune1Icon: string = '';
  rune2Icon: string = '';
  ngOnInit() {
    this.rune1Icon = this.runesService.getRunes(this.rune1).icon;
    this.rune2Icon = this.runesService.getRunes(this.rune2).icon;
    console.log('RUN1');
  }
}
