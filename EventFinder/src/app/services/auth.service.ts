import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User, Organizer, Account } from '../models/account.model';
import { UserTypes } from '../models/user.types.enum';
import { auth } from 'firebase/app';
import { User as fireUser} from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable, of, BehaviorSubject} from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  account: Observable<Account> = null;
  userType: UserTypes = UserTypes.User;
  user = null;

  isUserSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
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

    this.account = this.fireAuth.authState.pipe(
      switchMap(account => {
        if (account && this.userType === UserTypes.User) {
          return this.firestore.doc<User>(`users/${account.uid}`).valueChanges();
        } else if (account && this.userType === UserTypes.Organizer) {
          return this.firestore.doc<Organizer>(`organizers/${account.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );

  }

  setCookieVar(variable: string, value: string) {
    this.cookie.set(variable, value, 10, '/', 'localhost');
  }

  getCookieVar(variable: string): string {
    return this.cookie.get(variable);
  }

  setOrganizerType() {
    this.userType = UserTypes.Organizer;
    this.isUserSubject.next(false);
  }

  setUserType() {
    this.userType = UserTypes.User;
    this.isUserSubject.next(true);
  }

  isLoggedIn() {
    return this.user !== null;
  }

  async reset_email(email: string) {
    this.fireAuth.auth.sendPasswordResetEmail(email);
  }

  async login(email: string, password: string, rememberMe: boolean) {

    if (rememberMe) {
      this.fireAuth.auth.setPersistence(auth.Auth.Persistence.LOCAL);
    } else {
      this.fireAuth.auth.setPersistence(auth.Auth.Persistence.SESSION);
    }


    const credentials = await this.fireAuth.auth.signInWithEmailAndPassword(email, password);


    this.firestore.doc<User>(`users/${credentials.user.uid}`).snapshotChanges()
    .subscribe(user => {
      if (user.payload.exists) {
        this.setUserType();
      } else {
        this.setOrganizerType();
      }
    });
    return this.updateUserData(credentials.user);
  }

  async register(value) {
    const credentials = await this.fireAuth.auth.createUserWithEmailAndPassword(value.email, value.password);
    return this.updateUserData(credentials.user, value);
  }

  updateUserData(user: fireUser, value?) {
    let userRef;

    if (this.userType === UserTypes.User) {
      userRef = this.firestore.doc(`users/${user.uid}`);
    } else {
      userRef = this.firestore.doc(`organizers/${user.uid}`);
    }

    if (value) {
      if (this.userType === UserTypes.User) {
        userRef.set({
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
        }, {merge: true});
      } else {
        userRef.set({
          uid: user.uid,
          organization: value.organization,
          email: user.email,
          address: value.address,
          zip: value.zip,
          city: value.city,
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
    this.account = null;
    return this.router.navigate(['/']);
  }

  getLoggedInUser(): Account {
    let user: Account;
    this.account.subscribe(res => {user = res; });
    return user;
  }
}
