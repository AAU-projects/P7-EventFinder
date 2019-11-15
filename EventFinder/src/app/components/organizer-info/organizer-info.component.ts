import { Component, OnInit, Input } from '@angular/core';
import { Organizer } from 'src/app/models/account.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-organizer-info',
  templateUrl: './organizer-info.component.html',
  styleUrls: ['./organizer-info.component.scss']
})
export class OrganizerInfoComponent implements OnInit {
  @Input() user: Organizer;

  constructor(public authService: AuthService) {}

  ngOnInit() {
  }
}
