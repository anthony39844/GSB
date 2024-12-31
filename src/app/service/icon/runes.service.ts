import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RunesService {
  private runesMap: {[key: number]: any} = {}

  getRunes(key : number) {
    return this.runesMap[key]
  }

  setRunes(key: number, value : any) {
    this.runesMap[key] = value;
  }

}
