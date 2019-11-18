import { Component, OnInit, Input } from '@angular/core';
import { Organization } from 'src/app/models/account.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-organization-info',
  templateUrl: './organization-info.component.html',
  styleUrls: ['./organization-info.component.scss']
})
export class OrganizationInfoComponent implements OnInit {
  @Input() user: Organization;

  constructor(public authService: AuthService) {}

  ngOnInit() {
  }
}
