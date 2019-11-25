import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { MenuTabs } from './organization-menu.enum';
import { Observable, BehaviorSubject } from 'rxjs';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.scss']
})
export class OrganizationComponent implements OnInit {
  imgUrl: string;

  get menuTabs() { return MenuTabs; }
  StartTab = MenuTabs.Feedback;

  menuTabSubject: BehaviorSubject<MenuTabs> = new BehaviorSubject<MenuTabs>(this.StartTab);
  public menuTabObs: Observable<MenuTabs> = this.menuTabSubject.asObservable();

  subTabSubject: BehaviorSubject<MenuTabs> = new BehaviorSubject<MenuTabs>(null);
  public subTabObs: Observable<MenuTabs> = this.subTabSubject.asObservable();

  currentMenuTabSubject: BehaviorSubject<MenuTabs> = new BehaviorSubject<MenuTabs>(null);
  public currentMenuTabObs: Observable<MenuTabs> = this.currentMenuTabSubject.asObservable();

  constructor(public auth: AuthService, private storage: StorageService) {
    const sub = this.auth.account.subscribe(account => {
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
}
