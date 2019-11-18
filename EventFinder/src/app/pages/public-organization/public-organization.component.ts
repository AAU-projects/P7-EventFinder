import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { OrganizationService } from 'src/app/services/organization.service';
import { Organization } from 'src/app/models/account.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { MenuTabs } from '../organization/organization-menu.enum';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-public-organization',
  templateUrl: './public-organization.component.html',
  styleUrls: ['./public-organization.component.scss']
})

export class PublicOrganizationComponent implements OnInit {
  imgUrl: string;
  organization: Organization = null;

  get menuTabs() { return MenuTabs; }

  StartTab = MenuTabs.Profile;

  menuTabSubject: BehaviorSubject<MenuTabs> = new BehaviorSubject<MenuTabs>(this.StartTab);
  public menuTabObs: Observable<MenuTabs> = this.menuTabSubject.asObservable();

  subTabSubject: BehaviorSubject<MenuTabs> = new BehaviorSubject<MenuTabs>(null);
  public subTabObs: Observable<MenuTabs> = this.subTabSubject.asObservable();

  currentMenuTabSubject: BehaviorSubject<MenuTabs> = new BehaviorSubject<MenuTabs>(null);
  public currentMenuTabObs: Observable<MenuTabs> = this.currentMenuTabSubject.asObservable();

  constructor(private route: ActivatedRoute, private organizationService: OrganizationService, private storageService: StorageService) { }

  ngOnInit() {
    this.currentMenuTabSubject.next(this.StartTab);
    let orgID = null;
    this.route.params.forEach((params: Params) => {
        orgID = params.id;
      });

    const sub = this.organizationService.getOrganization(orgID).subscribe(org => {
      this.organization = org;
      const isub = this.storageService.getImageUrl(org.profileImage).subscribe(url => {
        this.imgUrl = url;
        isub.unsubscribe();
      });
      sub.unsubscribe();
    });
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
