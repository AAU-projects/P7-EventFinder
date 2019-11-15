import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { OrganizerService } from 'src/app/services/organizer.service';
import { Organizer } from 'src/app/models/account.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { MenuTabs } from '../organizer/organizer-menu.enum';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-public-organizer',
  templateUrl: './public-organizer.component.html',
  styleUrls: ['./public-organizer.component.scss']
})

export class PublicOrganizerComponent implements OnInit {
  imgUrl: string;
  organizer: Organizer = null;

  get menuTabs() { return MenuTabs; }

  StartTab = MenuTabs.Profile;

  menuTabSubject: BehaviorSubject<MenuTabs> = new BehaviorSubject<MenuTabs>(this.StartTab);
  public menuTabObs: Observable<MenuTabs> = this.menuTabSubject.asObservable();

  subTabSubject: BehaviorSubject<MenuTabs> = new BehaviorSubject<MenuTabs>(null);
  public subTabObs: Observable<MenuTabs> = this.subTabSubject.asObservable();

  currentMenuTabSubject: BehaviorSubject<MenuTabs> = new BehaviorSubject<MenuTabs>(null);
  public currentMenuTabObs: Observable<MenuTabs> = this.currentMenuTabSubject.asObservable();

  constructor(private route: ActivatedRoute, private organizerService: OrganizerService, private storageService: StorageService) { }

  ngOnInit() {
    this.currentMenuTabSubject.next(this.StartTab);
    let orgID = null;
    this.route.params.forEach((params: Params) => {
        orgID = params.id;
      });

    this.organizerService.getOrganizer(orgID).snapshotChanges().subscribe(result => {
        this.organizer = result.payload.data() as Organizer;
        this.storageService.getImageUrl(this.organizer.profileImage).subscribe(
          url => this.imgUrl = url
        );
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
