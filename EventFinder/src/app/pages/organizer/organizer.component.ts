import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { MenuTabs } from '../organizer/organizer-menu.enum';
import { Observable, BehaviorSubject } from 'rxjs';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-organizer',
  templateUrl: './organizer.component.html',
  styleUrls: ['./organizer.component.scss']
})
export class OrganizerComponent implements OnInit {
  imgUrl: string;

  get menuTabs() { return MenuTabs; }
  StartTab = MenuTabs.Profile;

  menuTabSubject: BehaviorSubject<MenuTabs> = new BehaviorSubject<MenuTabs>(this.StartTab);
  public menuTabObs: Observable<MenuTabs> = this.menuTabSubject.asObservable();

  subTabSubject: BehaviorSubject<MenuTabs> = new BehaviorSubject<MenuTabs>(null);
  public subTabObs: Observable<MenuTabs> = this.subTabSubject.asObservable();

  currentMenuTabSubject: BehaviorSubject<MenuTabs> = new BehaviorSubject<MenuTabs>(null);
  public currentMenuTabObs: Observable<MenuTabs> = this.currentMenuTabSubject.asObservable();

  constructor(public auth: AuthService, private storage: StorageService) {
    this.auth.account.subscribe(account => {
      this.storage.getImageUrl(account.profileImage).subscribe(
        url => this.imgUrl = url
      );
    });
  }

  ngOnInit() {
    this.currentMenuTabSubject.next(this.StartTab);
  }

  onMenuClick(tabName: MenuTabs) {
    this.menuTabSubject.next(tabName);
    this.subTabSubject.next(null);

    if (tabName !== MenuTabs.Events) {
      this.currentMenuTabSubject.next(tabName);
    }
  }

  onSubMenuClick(tabName: MenuTabs) {
    this.subTabSubject.next(tabName);
    this.currentMenuTabSubject.next(tabName);
  }
}
