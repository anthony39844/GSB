import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { defaultParticipantData, ParticipantData } from '../../interfaces/matchData.interface';

@Component({
  selector: 'app-champ-info',
  imports: [CommonModule],
  templateUrl: './champ-info.component.html',
  styleUrl: './champ-info.component.scss'
})

export class ChampInfoComponent {
  @Input() profile: ParticipantData = defaultParticipantData;

}
