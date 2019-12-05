import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { MenuTabs } from './organization-menu.enum';
import { Observable, BehaviorSubject } from 'rxjs';
import { StorageService } from 'src/app/services/storage.service';
import { Stars } from 'src/app/models/star.enum';
import { Organization } from 'src/app/models/account.model';

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.scss']
})
export class OrganizationComponent implements OnInit {
  get Stars() { return Stars; }
  imgUrl: string;
  org: Organization;

  get menuTabs() { return MenuTabs; }
  StartTab = MenuTabs.Profile;

  menuTabSubject: BehaviorSubject<MenuTabs> = new BehaviorSubject<MenuTabs>(this.StartTab);
  public menuTabObs: Observable<MenuTabs> = this.menuTabSubject.asObservable();

  subTabSubject: BehaviorSubject<MenuTabs> = new BehaviorSubject<MenuTabs>(null);
  public subTabObs: Observable<MenuTabs> = this.subTabSubject.asObservable();

  currentMenuTabSubject: BehaviorSubject<MenuTabs> = new BehaviorSubject<MenuTabs>(null);
  public currentMenuTabObs: Observable<MenuTabs> = this.currentMenuTabSubject.asObservable();

  constructor(public auth: AuthService, private storage: StorageService) {
    const sub = this.auth.account.subscribe(account => {
      this.org = account as Organization;
      const isub = this.storage.getImageUrl(account.profileImage).subscribe(url => {
        this.imgUrl = url;
        isub.unsubscribe();
      });
      sub.unsubscribe();
    });
  }

  ngOnInit() {
    this.currentMenuTabSubject.next(this.StartTab);
  }

  onMenuClick(tabName: MenuTabs) {
    this.menuTabSubject.next(tabName);
    this.subTabSubject.next(null);

    this.currentMenuTabSubject.next(tabName);
  }

  onSubMenuClick(tabName: MenuTabs) {
    this.subTabSubject.next(tabName);
    this.currentMenuTabSubject.next(tabName);
  }

  orgRating() {
    const rounded = Math.round(this.org.rating * 2) / 2;
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      if (i <= rounded) {
        stars.push(Stars.Full);
      } else if (i - 0.5 === rounded) {
        stars.push(Stars.Half);
      } else {
        stars.push(Stars.Empty);
      }
    }

    return stars;
  }
}
