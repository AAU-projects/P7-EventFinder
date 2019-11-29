import { Injectable } from '@angular/core';
import { Event } from '../models/event.model';
import { AuthService } from './auth.service';
import { EventService } from './event.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecommenderService {
  eventListSubject: BehaviorSubject<Event[]> = new BehaviorSubject<Event[]>(null);
  public eventListObs: Observable<Event[]> = this.eventListSubject.asObservable();

  constructor(public auth: AuthService, public eventService: EventService) {
  }

  public retrieveRecommenedEvents(account) {
      const eventList = [];
      this.eventService
        .getEventsById(account.recommended)
        .then(async elist => {
          // tslint:disable-next-line: prefer-for-of
          for (let index = 0; index < elist.length; index++) {
            const element = elist[index];
            await element.subscribe((event: Event) => {
              eventList.push(event);
              this.eventListSubject.next(eventList);
            });
          }
        });
  }
}
