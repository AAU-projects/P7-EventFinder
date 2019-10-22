import { Injectable } from '@angular/core';
import { AngularFirestore, QueryFn } from '@angular/fire/firestore';
import { EventModel } from '../models/event.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private firestore: AngularFirestore) { }

  async createEvent(values) {
    const id = this.firestore.createId();
    const eventRef = this.firestore.collection('events').doc<Event>(id);

    eventRef.set(values);

    return id;
  }

  async updateEvnt(id, values) {
    const eventRef = this.firestore.collection('events').doc<Event>(id);

    eventRef.set(values, {merge: true});

    return eventRef;
  }

  /* To get the data from the documents, use subscribe.
    .subscribe(snap => snap.forEach(docSnap => console.log(docSnap.id)))
   */
  async getEvents(limit: number = 5) {
    this.firestore.collection('events', ref => ref.orderBy('startDate', 'asc').limit(limit))
    .get();
  }

  async getEventsByQuery(query: QueryFn) {
    return this.firestore.collection('events', query).get();
  }

  getEvent(id) {
    const eventRef = this.firestore.collection('events').doc<EventModel>(id);

    return eventRef;
  }
}
