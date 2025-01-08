import { Component, Input } from '@angular/core';
import { HoverTooltipComponent } from '../hover-tooltip/hover-tooltip.component';
import { SumSpellsService } from '../../service/icon/sum-spells.service';

@Component({
  selector: 'app-sum-spells',
  imports: [HoverTooltipComponent],
  templateUrl: './sum-spells.component.html',
  styleUrl: './sum-spells.component.scss',
})
export class SumSpellsComponent {
  @Input() sumSpell1: number = 0;
  @Input() sumSpell2: number = 0;
  sumSpell1Path: string = '';
  sumSpell2Path: string = '';
  constructor(private sumSpellService: SumSpellsService) {}
  ngOnInit() {
    this.sumSpell1Path = this.sumSpellService.getSums(this.sumSpell1).icon;
    this.sumSpell2Path = this.sumSpellService.getSums(this.sumSpell2).icon;
  }
}
