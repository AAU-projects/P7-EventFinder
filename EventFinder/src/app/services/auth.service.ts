import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User, Organizer, Account } from '../models/account.model';
import { UserTypes } from '../models/user.types.enum';

import { User as fireUser} from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

import { Observable, of} from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  account: Observable<Account> = null;
  type: UserTypes = UserTypes.User;

  constructor(
    private fireAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router,
    private cookie: CookieService
  ) {
    /* this.account = this.fireAuth.authState.pipe(
      switchMap(account => {
        if (account && this.type === UserTypes.User) {
          this.loggedIn = true;
          return this.firestore.doc<User>(`users/${account.uid}`).valueChanges();
        } else if (account && this.type === UserTypes.Organizer) {
          this.loggedIn = true;
          return this.firestore.doc<Organizer>(`organizers/${account.uid}`).valueChanges();
        } else {
          this.loggedIn = false;
          return of(null);
        }
      })
    ); */
  }

  setCookieVar(variable: string, value: string) {
    this.cookie.set(variable, value);
  }

  getCookieVar(variable: string): string {
    return this.cookie.get(variable);
  }

  setOrganizerType() {
    this.type = UserTypes.Organizer;
  }

  setUserType() {
    this.type = UserTypes.User;
  }

  isLoggedIn(): boolean {
    const result = this.getCookieVar('loggedIn');
    return result === 'true';                    // Converts the value to a boolean
  }

  async login(email, password) {
    let credentials = await this.fireAuth.auth.signInWithEmailAndPassword(email, password);

    /* let bob = await credentials.user.getIdToken();

    credentials = await this.fireAuth.auth.signInWithCredential(credentials.credential); */

    this.firestore.doc<User>(`users/${credentials.user.uid}`).snapshotChanges()
    .subscribe(user => {
      if (user.payload.exists) {
        this.setUserType();
      } else {
        this.setOrganizerType();
      }
    });

    this.setCookieVar('loggedIn', 'true');
    return this.updateUserData(credentials.user);
  }

  async register(value) {
    const credentials = await this.fireAuth.auth.createUserWithEmailAndPassword(value.email, value.password);
    this.setCookieVar('loggedIn', 'true');
    return this.updateUserData(credentials.user, value);
  }

  updateUserData(user: fireUser, value?) {
    let userRef;

    if (this.type === UserTypes.User) {
      userRef = this.firestore.doc(`users/${user.uid}`);
    } else {
      userRef = this.firestore.doc(`organizers/${user.uid}`);
    }

    if (value) {
      if (this.type === UserTypes.User) {
        userRef.set({
          uid: user.uid,
          email: user.email,
          name: value.name,
          zip: value.zip,
          country: value.country,
          phone: value.phone,
          // sex: value.sex,
          birthday: value.birthday
        }, {merge: true});
      } else {
        userRef.set({
          uid: user.uid,
          email: user.email,
          name: value.name,
          address: value.address,
          zip: value.zip,
          country: value.country,
          phone: value.phone,
        }, {merge: true});
      }
    } else {
      const data = {
        uid: user.uid,
        email: user.email,
      };
      userRef.set(data, {merge: true});
    }

    this.account = userRef.valueChanges();
    return userRef.valueChanges();

  }

  async logout() {
    await this.fireAuth.auth.signOut();
    this.setCookieVar('loggedIn', 'false');
    this.account = null;
    return this.router.navigate(['/']);
  }

  getLoggedInUser(): Account {
    let user: Account;
    this.account.subscribe(res => {user = res; });
    return user;
  }
}

// https://fireship.io/lessons/angularfire-google-oauth/
// https://angularfirebase.com/lessons/role-based-authorization-with-firestore-nosql-and-angular-5/

// https://github.com/fireship-io/55-angularfire-google-auth/blob/master/src/app/services/auth.service.ts
// https://github.com/AngularTemplates/firebase-authentication-with-angular-7/blob/master/src/app/core/auth.service.ts
