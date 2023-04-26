import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private priceSource = new BehaviorSubject<number>(0);
  currentprice = this.priceSource.asObservable();

  constructor() {}

  changePrice(price: number | null | undefined) {
    if (price != null) {
      this.priceSource.next(price);
    }
  }
}
