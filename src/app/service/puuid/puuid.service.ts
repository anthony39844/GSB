import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PuuidService {
  private puuid: string = '';

  setPuuid(puuid: string): void {
    console.log('SET');
    this.puuid = puuid;
  }

  getPuuid(): string {
    console.log('GET');
    return this.puuid;
  }
}
