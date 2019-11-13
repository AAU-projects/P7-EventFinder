import { Component, OnInit } from '@angular/core';
import { OrganizationService } from 'src/app/services/organizer.service';
import { AccountService } from 'src/app/services/account.service';
import { AuthService } from 'src/app/services/auth.service';
import { Organization } from 'src/app/models/account.model';
import { skip } from 'rxjs/operators';

@Component({
  selector: 'app-organization-connections',
  templateUrl: './organization-connections.component.html',
  styleUrls: ['./organization-connections.component.scss']
})
export class OrganizationConnectionsComponent implements OnInit {
  org: Organization;
  users = [];

  constructor(private orgs: OrganizationService, private account: AccountService, private auth: AuthService) {
    this.orgs.getOrganization(this.auth.selectedOrganizationUid).subscribe(org => {
      this.org = org;
      this.users = [];
      org.connectedUsers.forEach(uid => this.account.getUserFromUid(uid).subscribe(user => {
        this.users.push({ name: `${user.firstname} ${user.lastname}`, email: user.email, uid: user.uid });
      }));
    });
  }

  removeUser(uid) {
    this.orgs.removeUser(uid, this.org);
  }

  ngOnInit() {
  }

}
