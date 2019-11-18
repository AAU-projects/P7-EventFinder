import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Organization } from '../models/account.model';
import { AuthService } from './auth.service';
import { AccountService } from './account.service';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {

  constructor(
    private firestore: AngularFirestore,
    private auth: AuthService,
    private account: AccountService) { }

  getOrganization(id: string) {
    const eventRef = this.firestore.collection('organizations').doc<Organization>(id).valueChanges();

    return eventRef;
  }

  removeUser(uid: string, org: Organization) {
    org.connectedUsers = org.connectedUsers.filter(id => id !== uid);
    const eventRef = this.firestore.collection('organizations').doc<Organization>(org.uid);
    eventRef.update(org);

    this.account.removeOrganization(org.uid, uid);
  }

  addUser(uid: string, org: Organization) {
    if (org.connectedUsers.find(user => user === uid)) {
      return false;
    } else {
      org.connectedUsers = org.connectedUsers.concat(uid);
      const eventRef = this.firestore.collection('organizations').doc<Organization>(org.uid);
      eventRef.update(org);

      this.account.addOrganization(org.uid, uid);
      return true;
    }
  }

  createOrgnization(value: Organization): string {
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
    this.auth.setOrganizationType(id);

    return id;
  }

  setLogo(imgPath: string) {
    const docref = this.firestore.doc(`organizations/${this.auth.selectedOrganizationUid}`);
    docref.set({profileImage: imgPath}, {merge: true});
  }
}
