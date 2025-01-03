import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'http://127.0.0.1:5000/'; // Flask backend URL

  constructor(private http: HttpClient) {}

  getPuuid(summoner: string, tag: string): Observable<any> {
    return this.http.get(`${this.baseUrl}puuid/${summoner}/${tag}`);
  }

  getMatchIds(puuid: string): Observable<any> {
    return this.http.get(`${this.baseUrl}match_ids/${puuid}`)
  }

  getMatchData(matchId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}get_matches/${matchId}`)
  }

  getRankData(puuid: string): Observable<any> {
    return this.http.get(`${this.baseUrl}get_rank/${puuid}`)
  }

  getSummonerSpellData(): Observable<any> {
    return this.http.get(`${this.baseUrl}get_sum_spells`)
  }

  getRunes(): Observable<any> {
    return this.http.get(`${this.baseUrl}get_runes`)
  }

}
