import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PuuidService {
  private puuid: string = '';

  setPuuid(puuid: string): void {
    this.puuid = puuid;
  }

  getPuuid(): string {
    return this.puuid;
  }
}