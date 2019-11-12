import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { SharedService } from 'src/app/services/shared.service';
import { NotificationService } from 'src/app/services/notification.service';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/services/account.service';
import { OrganizationService } from 'src/app/services/organizer.service';
import { tap, take} from 'rxjs/operators';

@Component({
  selector: 'app-navbar-user-dropdown',
  templateUrl: './navbar-user-dropdown.component.html',
  styleUrls: ['./navbar-user-dropdown.component.scss']
})

export class NavbarUserDropdownComponent {

  constructor(
    public auth: AuthService,
    private shared: SharedService,
    public notification: NotificationService,
    private router: Router,
    public account: AccountService,
    private orgs: OrganizationService) {
    auth.isUserObs.subscribe();
  }

  openLogin() {
    this.notification.hideNotification();
    this.shared.showLogin(true);
  }

  notifyLogout() {
    this.auth.logout();
    this.notification.notifySuccess('You have been logged out successfully.');
  }

  openRegister() {
    this.router.navigate(['/register']);
  }

  switchToOrganization(uid) {
    this.auth.setOrganizerType(uid);
    this.router.navigate(['/organizer']);
  }

  switchToUser() {
    this.auth.setUserType();
    this.router.navigate(['/user']);
  }
}
