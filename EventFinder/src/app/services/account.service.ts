import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Account, Tags } from '../models/account.model';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';

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


}
