import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/models/account.model';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnInit {
  @Input() user: User;

  constructor() { }

  ngOnInit() {
  }

}
