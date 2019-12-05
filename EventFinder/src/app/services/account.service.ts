import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Account, Tags, User } from '../models/account.model';
import { Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { take, tap, map } from 'rxjs/operators';
import { OrganizationService } from './organization.service';
import { StorageService } from './storage.service';
import { RecommenderService } from './recommender.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  currentUser: Account;
  baseUser: User;
  baseUserImg = '../../assets/images/logo.png';
  isUser: boolean;

  constructor(private auth: AuthService, private firestore: AngularFirestore, private storage: StorageService,
              private recommender: RecommenderService) {
    this.auth.account.subscribe(account => {
      this.currentUser = account;
      this.auth.userAccount.subscribe(user => {
        if (user) {
          this.baseUser = user;
          this.storage.getImageUrl(user.profileImage).subscribe(path => this.baseUserImg = path);
          this.recommender.retrieveRecommenedEvents(user);
        }
      });
    });

    this.auth.isUserObs.subscribe(value => { this.isUser = value; });
  }

  getUserFromEmail(email) {
    const userRef = this.firestore.collection<User>('users', ref => ref.where('email', '==', email).limit(1));

    return userRef.valueChanges();
  }

  getUserFromUid(uid) {
    const userRef = this.firestore.collection('users').doc<User>(uid).valueChanges();

    return userRef;
  }

  getBaseUserName() {
    if (this.baseUser) {
      return `${this.baseUser.firstname} ${this.baseUser.lastname}`;
    }
    return '';
  }

  editTagsOrPrefrences(taglist) {
    if (this.isUser) {
      const batch = this.firestore.firestore.batch();
      const userRef = this.firestore.firestore.collection(`users`).doc(this.currentUser.uid);
      const recommenderRef = this.firestore.firestore.collection(`recommender`).doc(this.currentUser.uid);

      batch.set(userRef, { preferences: taglist }, { merge: true });
      const recommenderPreferences: { [key: string]: number } = {};
      taglist.forEach(element => {
        recommenderPreferences[element] = 1;
      });
      batch.set(recommenderRef, recommenderPreferences, { merge: true });

      batch.commit();
    } else {
      const userRef = this.firestore.doc(`organizations/${this.auth.selectedOrganizationUid}`);

      userRef.set({ tags: taglist }, { merge: true });
    }
  }

  removeOrganization(orgUid: string, userId: string) {
    const userRef = this.firestore.doc<User>(`users/${userId}`);

    const sub = userRef.valueChanges().subscribe(user => {
      if (user.organizations) {
        user.organizations = user.organizations.filter(uid => uid !== orgUid);
      }
      userRef.update(user);
      sub.unsubscribe();
    });
  }

  addOrganization(orgUid: string, userUid?: string) {
    let userRef: AngularFirestoreDocument<User>;
    if (userUid) {
      userRef = this.firestore.doc<User>(`users/${userUid}`);
    } else {
      userRef = this.firestore.doc<User>(`users/${this.baseUser.uid}`);
    }

    const sub = userRef.valueChanges().subscribe(user => {
      if (user.organizations.length > 0) {
        user.organizations.concat(orgUid);
      } else {
        user.organizations = [orgUid];
      }
      userRef.update(user);
      sub.unsubscribe();
    });
  }


}
