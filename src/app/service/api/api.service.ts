import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'http://127.0.0.1:5000/'; // Flask backend URL

  constructor(private http: HttpClient) {}

  getPuuid(summoner: string): Observable<any> {
    return this.http.get(`${this.baseUrl}puuid/${summoner}`);
  }

  getMatchIds(puuid: string): Observable<any> {
    return this.http.get(`${this.baseUrl}match_ids/${puuid}`)
  }

  getMatchData(matchId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}get_matches/${matchId}`)

  }

  getAccountData(puuid: string): Observable<any> {
    return this.http.get(`${this.baseUrl}get_account/${puuid}`)
  }
}
