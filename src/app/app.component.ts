import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ApiService } from './service/api/api.service'; 

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  championsMap: {[key: string]: any}= {}
  title = 'GSB';
  constructor(private apiService: ApiService) {}
}
