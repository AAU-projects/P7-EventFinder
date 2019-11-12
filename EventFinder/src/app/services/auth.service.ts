import { Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User, Organization, Account } from '../models/account.model';
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
  selectedOrganizationUid: string;
  public userType: AccountTypes = this.getUserType();
  userAccount: Observable<User>;
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
      if (user) {
        this.userAccount = this.firestore.doc<User>(`users/${user.uid}`).valueChanges();
      } else {
        this.userAccount = of(null);
      }
    });

    this.account = this.fireAuth.authState.pipe(
      switchMap(account => {
        if (account && this.userType === AccountTypes.User) {
          return this.firestore
            .doc<User>(`users/${this.user.uid}`)
            .valueChanges();
        } else if (account && this.userType === AccountTypes.Organization) {
          return this.firestore
            .doc<Organization>(`organizations/${this.selectedOrganizationUid}`)
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
      this.selectedOrganizationUid = this.getCookieVar('orgUID');
      return AccountTypes.Organization;
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

  deleteCookieVar(variable: string) {
    return this.cookie.delete(variable);
  }

  setOrganizerType(uid) {
    this.userType = AccountTypes.Organization;
    this.isUserSubject.next(false);
    this.selectedOrganizationUid = uid;
    this.setCookieVar('type', AccountTypes.Organization);
    this.setCookieVar('orgUID', uid);
  }

  setUserType() {
    this.userType = AccountTypes.User;
    this.isUserSubject.next(true);
    this.setCookieVar('type', AccountTypes.User);
    this.deleteCookieVar('orgUID');
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

    this.updateUserData(credentials.user);

    if (redirect) {
      this.router.navigate(['/user']);
    }
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
      userRef = this.firestore.doc(`organizations/${this.user.uid}`);
    }

    userRef.set({profileImage: location}, { merge: true });

    this.account = userRef.valueChanges();
    return userRef.valueChanges();
  }

  updateUserData(user: fireUser, value?) {
    this.setUserType();
    const userRef = this.firestore.doc<User>(`users/${user.uid}`);

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
            birthday: value.birthday,
            organizations: [],
            profileImage: value.profileImage,
            preferences: []
          }
        );
      }
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
