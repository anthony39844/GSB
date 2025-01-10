import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  start = 0;
  private baseUrl = 'http://127.0.0.1:5000/'; // Flask backend URL

  constructor(private http: HttpClient) {}

  getPuuid(summoner: string, tag: string): Observable<any> {
    return this.http.get(`${this.baseUrl}puuid/${summoner}/${tag}`);
  }

  getMatchIds(puuid: string, newSummoner: boolean): Observable<any> {
    if (newSummoner) {
      this.start = 0;
    }
    const url = `${this.baseUrl}match_ids/${puuid}/${this.start}`;
    this.start += 4;
    return this.http.get(url);
  }

  getMatchData(matchId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}get_matches/${matchId}`);
  }

  getRankData(puuid: string): Observable<any> {
    return this.http.get(`${this.baseUrl}get_rank/${puuid}`);
  }

  getSummonerSpellData(): Observable<any> {
    return this.http.get(`${this.baseUrl}get_sum_spells`);
  }

  getRunes(): Observable<any> {
    return this.http.get(`${this.baseUrl}get_runes`);
  }

  getChamps(): Observable<any> {
    return this.http.get(`${this.baseUrl}get_champs`);
  }

  getItems(): Observable<any> {
    return this.http.get(`${this.baseUrl}get_items`);
  }
}
