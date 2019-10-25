import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Account } from '../models/account.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  currentUser;
  isUserObs;

  constructor(private auth: AuthService) {
    this.currentUser = auth.account;
    this.isUserObs = auth.isUserObs;
  }


}
