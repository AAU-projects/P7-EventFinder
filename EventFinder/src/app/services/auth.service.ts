import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User, Organizer, Account } from '../models/account.model';
import { UserTypes } from "../models/user.types.enum";

import { User as fireUser} from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  account: Observable<Account>;
  type: UserTypes = UserTypes.User;

  constructor(
    private fireAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router
  ) {
    this.account = this.fireAuth.authState.pipe(
      switchMap(account => {
        if (account && this.type === UserTypes.User) {
          return this.firestore.doc<User>(`users/${account.uid}`).valueChanges();
        } else if (account && this.type === UserTypes.Organizer) {
          return this.firestore.doc<Organizer>(`organizers/${account.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }

  async login(email, password) {
    const credentials = await this.fireAuth.auth.signInWithEmailAndPassword(email, password);

    return this.updateUserData(credentials.user);
  }

  updateUserData(user: fireUser) {
    if (this.type === UserTypes.User) {
      const userRef: AngularFirestoreDocument<User> = this.firestore.doc('users/${user.uid}');
    } else {
      const userRef: AngularFirestoreDocument<Organizer> = this.firestore.doc('organizers/${user.uid}');
    }


  }

  async logout() {
    await this.fireAuth.auth.signOut();
    return this.router.navigate(['/']);
  }
}

// https://fireship.io/lessons/angularfire-google-oauth/
// https://angularfirebase.com/lessons/role-based-authorization-with-firestore-nosql-and-angular-5/

// https://github.com/fireship-io/55-angularfire-google-auth/blob/master/src/app/services/auth.service.ts
// https://github.com/AngularTemplates/firebase-authentication-with-angular-7/blob/master/src/app/core/auth.service.ts