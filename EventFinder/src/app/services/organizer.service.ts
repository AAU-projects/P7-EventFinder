import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Organization } from '../models/account.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {

  constructor(private firestore: AngularFirestore, private auth: AuthService) { }

  getOrganization(id) {
    const eventRef = this.firestore.collection('organizations').doc<Organization>(id).valueChanges();

    return eventRef;
  }

  createOrgnization(value): string {
    const id = this.firestore.createId();
    const docref = this.firestore.doc<Organization>(`organizations/${id}`);

    docref.set({
      uid: id,
      email: value.email,
      zip: value.zip,
      country: value.country,
      city: value.city,
      phone: value.phone,
      profileImage: value.profileImage,
      organization: value.organization,
      address: value.address,
      about: value.about,
      tags: [],
      connectedUsers: [this.auth.user.uid]
    }, {merge: true});

    this.auth.selectedOrganizationUid = id;
    this.auth.setOrganizerType(id);

    return id;
  }

  setLogo(imgPath) {
    const docref = this.firestore.doc(`organizations/${this.auth.selectedOrganizationUid}`);
    docref.set({profileImage: imgPath}, {merge: true});
  }
}
