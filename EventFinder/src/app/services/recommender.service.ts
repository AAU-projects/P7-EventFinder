import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
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

  constructor(public auth: AuthService, public eventService: EventService, private firestore: AngularFirestore) {
  }

  public retrieveRecommenedEvents(account) {
      const eventList = [];
      this.eventService
        .getEventsById(account.recommended)
        .then(async elist => {
          for (const element of elist) {
            await element.subscribe((event: Event) => {
              eventList.push(event);
              this.eventListSubject.next(eventList);
            });
          }
        });
  }

  getRecommendedFromUserUid(uid) {
    return this.firestore.collection('recommender').doc(uid).valueChanges();
  }
}
