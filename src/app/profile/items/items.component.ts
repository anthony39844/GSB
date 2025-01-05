import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-items',
  imports: [CommonModule],
  templateUrl: './items.component.html',
  styleUrl: './items.component.scss',
})
export class ItemsComponent {
  @Input() items: number[] = [];
}
