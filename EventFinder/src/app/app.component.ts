import { Component, OnInit } from '@angular/core';
import { SharedService } from './services/shared.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'EventFinder';
  subscription: Subscription;
  showLogin = false;

  constructor(private shared: SharedService) { }

  ngOnInit() {
    this.subscription = this.shared.getLoginValue()
      .subscribe((item: boolean) => this.showLogin = item);
  }
}
