import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-sum-spells',
  imports: [],
  templateUrl: './sum-spells.component.html',
  styleUrl: './sum-spells.component.scss',
})
export class SumSpellsComponent {
  @Input() sumSpell1: string = '';
  @Input() sumSpell2: string = '';
}
