import { Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User, Organizer, Account } from '../models/account.model';
import { AccountTypes } from '../models/account.types.enum';
import { auth } from 'firebase/app';
import { User as fireUser } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  account: Observable<Account> = null;
  userType: AccountTypes = this.getUserType();
  user: fireUser = null;

  isUserSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.isUser());
  public isUserObs: Observable<boolean> = this.isUserSubject.asObservable();

  constructor(
    private fireAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router,
    private cookie: CookieService
  ) {
    this.fireAuth.authState.subscribe(user => {
      this.user = user;
    });

    /* this.fireAuth.authState.pipe(
      switchMap(fireuser => {
        if (fireuser) {
          const promise = this.firestore.doc<User>(`users/${fireuser.uid}`).get().toPromise();
          return promise.then((doc) => {
              if (doc.exists) {
                this.account = this.firestore.doc<User>(`users/${fireuser.uid}`).valueChanges();
              } else {
                this.account = this.firestore.doc<Organizer>(`organizers/${fireuser.uid}`).valueChanges();
              }
            }).catch((error) => {
                return of(null);
            });
        }
      })
    ); */

    this.account = this.fireAuth.authState.pipe(
      switchMap(account => {
        if (account && this.userType === AccountTypes.User) {
          return this.firestore
            .doc<User>(`users/${account.uid}`)
            .valueChanges();
        } else if (account && this.userType === AccountTypes.Organizer) {
          return this.firestore
            .doc<Organizer>(`organizers/${account.uid}`)
            .valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }

  getUserType() {
    if (this.cookie.check('type')){
      if (this.getCookieVar('type') === AccountTypes.User) {
        return AccountTypes.User;
      }
      return AccountTypes.Organizer;
    }
    return AccountTypes.User;
  }

  isUser() {
    if (this.cookie.check('type')){
      if (this.getCookieVar('type') === AccountTypes.User) {
        return true;
      }
      return false;
    }
    return true;
  }

  setCookieVar(variable: string, value: string) {
    this.cookie.set(variable, value, 30, '/', 'localhost');
  }

  getCookieVar(variable: string): string {
    return this.cookie.get(variable);
  }

  setOrganizerType() {
    this.userType = AccountTypes.Organizer;
    this.isUserSubject.next(false);
    this.setCookieVar('type', AccountTypes.Organizer);
    console.log('org');
  }

  setUserType() {
    this.userType = AccountTypes.User;
    this.isUserSubject.next(true);
    this.setCookieVar('type', AccountTypes.User);
    console.log('usr');
  }

  isLoggedIn() {
    return this.user !== null;
  }

  async reset_email(email: string) {
    this.fireAuth.auth.sendPasswordResetEmail(email);
  }

  async login(email: string, password: string, rememberMe: boolean, redirect: boolean) {
    if (rememberMe) {
      this.fireAuth.auth.setPersistence(auth.Auth.Persistence.LOCAL);
    } else {
      this.fireAuth.auth.setPersistence(auth.Auth.Persistence.SESSION);
    }

    const credentials = await this.fireAuth.auth.signInWithEmailAndPassword(
      email,
      password
    );

    this.firestore
      .doc<User>(`users/${credentials.user.uid}`)
      .get()
      .subscribe(doc => {
        if (doc.exists) {
          this.setUserType();
        } else {
          this.setOrganizerType();
        }
        this.updateUserData(credentials.user);
        if (redirect) {
          if (this.userType === AccountTypes.User) {
            this.router.navigate(['/user']);
          } else {
          this.router.navigate(['/organizer']);
          }
        }
      });
  }

  async register(value) {
    const credentials = await this.fireAuth.auth.createUserWithEmailAndPassword(
      value.email,
      value.password
    );
    return this.updateUserData(credentials.user, value);
  }

  setCurrentUserProfileImage(location) {
    let userRef;

    if (this.userType === AccountTypes.User) {
      userRef = this.firestore.doc(`users/${this.user.uid}`);
    } else {
      userRef = this.firestore.doc(`organizers/${this.user.uid}`);
    }

    userRef.set({profileImage: location}, { merge: true });

    this.account = userRef.valueChanges();
    return userRef.valueChanges();
  }

  updateUserData(user: fireUser, value?) {
    let userRef;

    if (this.userType === AccountTypes.User) {
      userRef = this.firestore.doc(`users/${user.uid}`);
    } else {
      userRef = this.firestore.doc(`organizers/${user.uid}`);
    }

    if (value) {
      if (this.userType === AccountTypes.User) {
        userRef.set(
          {
            uid: user.uid,
            email: user.email,
            firstname: value.firstname,
            lastname: value.lastname,
            zip: value.zip,
            country: value.country,
            city: value.city,
            phone: value.phone,
            sex: value.sex,
            birthday: value.birthday
          },
          { merge: true }
        );
      } else {
        userRef.set(
          {
            uid: user.uid,
            organization: value.organization,
            email: user.email,
            address: value.address,
            zip: value.zip,
            city: value.city,
            country: value.country,
            phone: value.phone
          },
          { merge: true }
        );
      }
    } else {
      const data = {
        uid: user.uid,
        email: user.email
      };
      userRef.set(data, { merge: true });
    }

    this.account = userRef.valueChanges();
    return userRef.valueChanges();
  }

  async logout() {
    await this.fireAuth.auth.signOut();
    this.account = null;
    return this.router.navigate(['/']);
  }

  getLoggedInUser(): Account {
    let user: Account;
    this.account.subscribe(res => {
      user = res;
    });
    return user;
  }
}
