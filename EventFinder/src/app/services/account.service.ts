import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Account, Tags, User } from '../models/account.model';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { take, tap, map } from 'rxjs/operators';
import { OrganizationService } from './organizer.service';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  currentUser: Account;
  baseUser: User;
  baseUserImg = '../../assets/images/logo.png';
  isUser: boolean;

  constructor(private auth: AuthService, private firestore: AngularFirestore, private storage: StorageService) {
    this.auth.account.subscribe(account => {
      this.currentUser = account;
      this.auth.userAccount.subscribe(user => {
        if (user) {
          this.baseUser = user;
          this.storage.getImageUrl(user.profileImage).subscribe(path => this.baseUserImg = path);
        }
      });
    });

    this.auth.isUserObs.subscribe(value => { this.isUser = value; });
  }

  getUserFromUid(uid) {
    const eventRef = this.firestore.collection('users').doc<User>(uid).valueChanges();

    return eventRef;
  }

  getBaseUserName() {
    if (this.baseUser) {
      return `${this.baseUser.firstname} ${this.baseUser.lastname}`;
    }
    return '';
  }

  editTagsOrPrefrences(taglist) {
    if (this.isUser) {
      const userRef = this.firestore.doc(`users/${this.currentUser.uid}`);

      userRef.set({ preferences: taglist }, { merge: true });
    } else {
      const userRef = this.firestore.doc(`organizations/${this.auth.selectedOrganizationUid}`);

      userRef.set({ tags: taglist }, { merge: true });
    }
  }

  removeOrganization(orgUid: string, userId: string) {
    const userRef = this.firestore.doc(`users/${userId}`);

    userRef.valueChanges().pipe(
      take(1), map(user => user as User), tap(user => {
          if (user.organizations !== undefined) {
            user.organizations = user.organizations.filter(uid => uid !== orgUid);
          }

          userRef.set(user);
        })
    ).subscribe();
  }

  addOrganization(uid: string) {
      const userRef = this.firestore.doc(`users/${this.currentUser.uid}`);
      let orgs = [uid];

      userRef.valueChanges().pipe(
        take(1), map(user => user as User), tap(user => {
            if (user.organizations !== undefined) {
              orgs = orgs.concat(user.organizations);
            }

            userRef.set({organizations: orgs}, { merge: true });
          })
      ).subscribe();
  }


}
