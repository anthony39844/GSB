import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApiService } from './service/api.service';
import { provideHttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getData().subscribe(data => {
      console.log(data);
    });
  }
  title = 'GSB';
}
