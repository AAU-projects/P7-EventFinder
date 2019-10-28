import { Injectable } from '@angular/core';
import { AngularFirestore, QueryFn } from '@angular/fire/firestore';
import { Title } from '@angular/platform-browser';

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

  getEventsTwo(limit: number = 5) {
    return this.firestore.collection('events', ref => ref.orderBy('startDate', 'asc').limit(limit)).snapshotChanges();
  }

  async getEventsByQuery(query: QueryFn) {
    return this.firestore.collection('events', query).get();
  }

  async getEvent(id) {
    const eventRef = this.firestore.collection('events').doc<Event>(id);

    return eventRef;
  }
}
