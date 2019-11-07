import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Organization } from '../models/account.model';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {

  constructor(private firestore: AngularFirestore) { }

  getOrganization(id) {
    const eventRef = this.firestore.collection('organizers').doc<Organization>(id);

    return eventRef;
  }

  createOrgnization(value): string {
    return '';
  }

  setLogo(imgPath) {

  }
}
