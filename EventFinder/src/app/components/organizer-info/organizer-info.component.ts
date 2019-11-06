import { Component, OnInit, Input } from '@angular/core';
import { Organization } from 'src/app/models/account.model';

@Component({
  selector: 'app-organizer-info',
  templateUrl: './organizer-info.component.html',
  styleUrls: ['./organizer-info.component.scss']
})
export class OrganizerInfoComponent implements OnInit {
  @Input() user: Organization;

  constructor() { }

  ngOnInit() {
  }

}
