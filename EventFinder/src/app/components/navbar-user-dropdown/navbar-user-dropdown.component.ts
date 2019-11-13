import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { SharedService } from 'src/app/services/shared.service';
import { NotificationService } from 'src/app/services/notification.service';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/services/account.service';
import { OrganizationService } from 'src/app/services/organizer.service';
import { tap, take} from 'rxjs/operators';
import { StorageService } from 'src/app/services/storage.service';
import { Organization } from 'src/app/models/account.model';

@Component({
  selector: 'app-navbar-user-dropdown',
  templateUrl: './navbar-user-dropdown.component.html',
  styleUrls: ['./navbar-user-dropdown.component.scss']
})

export class NavbarUserDropdownComponent {
  organizations = [];

  constructor(
    public auth: AuthService,
    private shared: SharedService,
    public notification: NotificationService,
    private router: Router,
    public account: AccountService,
    private orgs: OrganizationService,
    public storage: StorageService) {
    this.auth.account.subscribe(_ => {
      this.auth.userAccount.subscribe(user => {
        if (user) {
          this.organizations.length = 0;
          user.organizations.forEach(id => {
            this.orgs.getOrganization(id).subscribe(organization => {
              const org = organization;
              this.storage.getImageUrl(org.profileImage).subscribe(path => {
                this.organizations.push([org, path]);
              });
            });
          });
        }
      });
    });
  }

  getProfileImage(org: Organization){
    this.storage.getImageUrl(org.profileImage);
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

class Pair {
  organization: Organization;
  logo: string;

  constructor(org: Organization, url: string) {
    this.organization = org;
    this.logo = url;
  }
}
