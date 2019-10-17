import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private firestore: AngularFirestore) { }

  async createEvent(values) {
    const id = this.firestore.createId();
    const eventRef = this.firestore.collection('events').doc(id);

    eventRef.set(values);

    return id;
  }

  async updateEvnt() {}

  async getEvents() {}

  async getEvent() {}
}
