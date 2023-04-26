import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IEvent } from '../../entities/event/event.model';

@Injectable()
export class DataService {
  private eventSource = new BehaviorSubject<IEvent | null>(null);
  currentEvent = this.eventSource.asObservable();

  constructor() {}

  updateCurrentEvent(event: IEvent | null) {
    this.eventSource.next(event);
  }
}
