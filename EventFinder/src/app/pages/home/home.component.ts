import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UserTypes } from 'src/app/models/user.types.enum';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private shared: SharedService) { }

  ngOnInit() {
  }

  openLogin() {
    this.shared.changeLogin(true);
  }

}
