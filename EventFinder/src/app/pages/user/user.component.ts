import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/account.model';
import { StorageService } from 'src/app/services/storage.service';
import { take, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  imgUrl: string;
  user: User;

  userMenuSubject: BehaviorSubject<string> = new BehaviorSubject<string>('Profile');
  public userMenuObs: Observable<string> = this.userMenuSubject.asObservable();

  constructor(public auth: AuthService, private storage: StorageService) {
    const sub = this.auth.account.subscribe(account => {
      this.user = account as User;
      const isub = this.storage.getImageUrl(this.user.profileImage).subscribe(url => {
        this.imgUrl = url;
        isub.unsubscribe();
      });
      sub.unsubscribe();
    });
   }

  ngOnInit() {

  }

  onMenuClick(menuName: string) {
    this.userMenuSubject.next(menuName);
  }
}
