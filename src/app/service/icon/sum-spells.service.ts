import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SumSpellsService {

  private Sums: {[key: number]: any} = {}

  getSums(key: number) {
    return this.Sums[key]
  }

  setSums(key: number, value: any) {
    this.Sums[key] = value;
  }
}
