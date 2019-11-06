import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Organization } from '../models/account.model';

@Injectable({
  providedIn: 'root'
})
export class OrganizerService {

  constructor(private firestore: AngularFirestore) { }

  getOrganizer(id) {
    const eventRef = this.firestore.collection('organizers').doc<Organization>(id);

    return eventRef;
  }
}
