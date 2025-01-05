import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-runes',
  imports: [],
  templateUrl: './runes.component.html',
  styleUrl: './runes.component.scss',
})
export class RunesComponent {
  @Input() rune1: string = '';
  @Input() rune2: string = '';
}
