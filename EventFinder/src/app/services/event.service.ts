import { Injectable } from '@angular/core';
import { AngularFirestore, QueryFn } from '@angular/fire/firestore';
import { Event } from '../models/event.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private firestore: AngularFirestore) { }

  createEvent(values) {
    const id = this.firestore.createId();
    const eventRef = this.firestore.collection('events').doc<Event>(id);

    eventRef.set(values);

    return id;
  }

  async updateEvent(id, values) {
    const eventRef = this.firestore.collection('events').doc<Event>(id);

    eventRef.set(values, {merge: true});

    return eventRef;
  }

  getEvents(limit: number = 5) {
    return this.firestore.collection('events', ref => ref.orderBy('startDate', 'asc').limit(limit)).snapshotChanges();
  }

  getEventsBySearch(search, limit: number = 15) {
    return this.firestore.collection('events', ref => ref.where('searchTerms', 'array-contains', search)).snapshotChanges();
  }

  async getEventsByQuery(query: QueryFn) {
    return this.firestore.collection('events', query).get();
  }

  getEvent(id) {
    const eventRef = this.firestore.collection('events').doc<Event>(id);

    return eventRef;
  }

  getAllEventsFromOrganizer(orgId: string) {
    return this.firestore.collection('events', ref => ref.where('organizationId', '==', orgId)).snapshotChanges();
  }
}
