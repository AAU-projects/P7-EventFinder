import { Component, OnInit } from '@angular/core';
import { OrganizationService } from 'src/app/services/organization.service';
import { AccountService } from 'src/app/services/account.service';
import { AuthService } from 'src/app/services/auth.service';
import { Organization, User } from 'src/app/models/account.model';
import { NotificationService } from 'src/app/services/notification.service';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-organization-connections',
  templateUrl: './organization-connections.component.html',
  styleUrls: ['./organization-connections.component.scss']
})
export class OrganizationConnectionsComponent implements OnInit {
  org: Organization;
  users = [];
  userSubs = [];
  searchFeild: string;
  valid = false;
  showPopup = false;
  ctx: {title: string, message: string, uid: string, name: string, type: string};

  constructor(
    private orgs: OrganizationService,
    private account: AccountService,
    private auth: AuthService,
    private notification: NotificationService,
    private router: Router) {
    this.orgs.getOrganization(this.auth.selectedOrganizationUid).subscribe(org => {
      this.org = org;
      this.users = [];
      org.connectedUsers.forEach(uid => {
        const sub = this.account.getUserFromUid(uid).subscribe(user => {
          this.users.push({ name: `${user.firstname} ${user.lastname}`, email: user.email, uid: user.uid });
          sub.unsubscribe();
        });
      });
    });
  }

  addUser() {
    const sub = this.account.getUserFromEmail(this.searchFeild).subscribe(results => {
      if (results.length === 0) {
        this.notification.notifyError(`Could not find any user with email: ${this.searchFeild}`);
      } else {
        this.ctx = {title: 'Add Staff',
                    message: `Add ${results[0].firstname} ${results[0].lastname} to ${this.org.organization}?`,
                    uid: results[0].uid,
                    name: `${results[0].firstname} ${results[0].lastname}`,
                    type: 'add'};
        this.showPopup = true;
      }
      sub.unsubscribe();
    });
  }

  checkEmail() {
    const check = new FormControl(this.searchFeild, Validators.email);
    this.valid = !check.hasError('email');
  }

  removeUser(uid, name) {
    this.ctx = {
      title: `Remove ${name} from ${this.org.organization}`,
      message: `Are you sure you want to remove ${name}?`,
      uid,
      name,
      type: 'remove'
    };
    this.showPopup = true;
  }

  confirm() {
    if (this.ctx.type === 'add') {
      if (this.orgs.addUser(this.ctx.uid, this.org)) {
        this.notification.notifySuccess(`${this.ctx.name} has successfully been added to ${this.org.organization}.`);
      } else {
        this.notification.notifyInfo(`This user is already apart of ${this.org.organization}.`);
      }
    } else {
      this.orgs.removeUser(this.ctx.uid, this.org);
      if (this.ctx.uid === this.account.baseUser.uid) {
        this.auth.setUserType();
        this.router.navigate(['/user']);
        this.notification.notifySuccess(`You has successfully been removed from ${this.org.organization}.`);
      } else {
        this.notification.notifySuccess(`${this.ctx.name} has successfully been removed from the ${this.org.organization}.`);
      }
    }
    this.showPopup = false;
    this.searchFeild = '';
  }

  cancel() {
    this.showPopup = false;
  }

  ngOnInit() {
  }

}
