import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/models/account.model';
import { DatePipe, TitleCasePipe } from '@angular/common';

@Component({
  providers: [DatePipe, TitleCasePipe],
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnInit {
  @Input() user: User;

  constructor(public datepipe: DatePipe, private titlecasePipe: TitleCasePipe ) { }

  ngOnInit() {
  }

  displaySex() {
    return this.titlecasePipe.transform(this.user.sex);
  }

  displayBirthdate() {
    return this.datepipe.transform(this.user.birthday, 'dd/MM/yyyy');
  }
}
