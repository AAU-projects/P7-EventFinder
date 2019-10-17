import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { MenuTabs } from '../organizer/organizer-menu.enum';
import { Observable, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-organizer',
  templateUrl: './organizer.component.html',
  styleUrls: ['./organizer.component.scss']
})
export class OrganizerComponent implements OnInit {

  get menuTabs() { return MenuTabs; }

  menuTabSubject: BehaviorSubject<MenuTabs> = new BehaviorSubject<MenuTabs>(MenuTabs.Events);
  public menuTabObs: Observable<MenuTabs> = this.menuTabSubject.asObservable();

  constructor(public auth: AuthService) { }

  ngOnInit() {
  }

  onMenuClick(tabName) {

    this.menuTabSubject.next(this.getEnumFromName(tabName));
  }

  getEnumFromName(tabName) {
    switch (tabName) {
      case 'Profile': {
        return MenuTabs.Profile;
      }
      case 'Activity': {
        return MenuTabs.Activity;
      }
      case 'Events': {
        return MenuTabs.Events;
      }
      case 'Feedback': {
        return MenuTabs.Feedback;
      }
      case 'Tickets': {
        return MenuTabs.Tickets;
      }
      case 'Preferences': {
        return MenuTabs.Preferences;
      }
      default: {
        return MenuTabs.Profile;
      }
    }
  }

}
