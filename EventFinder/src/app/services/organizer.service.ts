import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Organizer } from '../models/account.model';

@Injectable({
  providedIn: 'root'
})
export class OrganizerService {

  constructor(private firestore: AngularFirestore) { }

  getOrganizer(id) {
    const eventRef = this.firestore.collection('organizers').doc<Organizer>(id);

    return eventRef;
  }
}
