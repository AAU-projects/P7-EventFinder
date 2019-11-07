import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Account, Tags, User } from '../models/account.model';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { take, tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  currentUser: Account;
  isUser: boolean;

  constructor(private auth: AuthService, private firestore: AngularFirestore) {
    this.auth.account.subscribe(account => { this.currentUser = account; });
    this.auth.isUserObs.subscribe(value => { this.isUser = value; });
  }

  editTagsOrPrefrences(taglist) {
    if (this.isUser) {
      const userRef = this.firestore.doc(`users/${this.currentUser.uid}`);

      userRef.set({ preferences: taglist }, { merge: true });
    } else {
      const userRef = this.firestore.doc(`organizers/${this.currentUser.uid}`);

      userRef.set({ tags: taglist }, { merge: true });
    }
  }

  addOrganization(uid: string) {
    if (this.isUser) {
      const userRef = this.firestore.doc(`users/${this.currentUser.uid}`);
      let orgs = [uid];

      userRef.valueChanges().pipe(
        take(1), map(user => user as User), tap(user => {
            orgs = orgs.concat(user.organizations);
            userRef.set({organizations: orgs}, { merge: true });
          })
      );
    }
  }


}
