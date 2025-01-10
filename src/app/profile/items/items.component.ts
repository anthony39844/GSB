import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HoverTooltipComponent } from '../hover-tooltip/hover-tooltip.component';

@Component({
  selector: 'app-items',
  imports: [CommonModule, HoverTooltipComponent],
  templateUrl: './items.component.html',
  styleUrl: './items.component.scss',
})
export class ItemsComponent {
  @Input() items: number[] = [];
  ngOnInit() {
    console.log(this.items);
  }
}
