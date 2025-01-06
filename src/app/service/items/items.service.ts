import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root',
})
export class ItemsService {
  constructor(private apiService: ApiService) {}
  itemData: { [key: string]: any } = {};
  hasData = false;
  setData() {
    if (!this.hasData) {
      this.apiService.getItems().subscribe((items) => {
        if (items) {
          for (let item in items.data) {
            const currentItem = items.data[item];
            this.itemData[item] = {
              name: currentItem.name,
              description: currentItem.description,
              image: currentItem.image,
            };
          }
          this.hasData = true;
        }
      });
    }
  }

  getData(key: string) {
    return this.itemData[key];
  }
}
