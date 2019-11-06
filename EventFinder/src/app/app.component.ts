import { Component, OnInit } from '@angular/core';
import { SharedService } from './services/shared.service';
import { Subscription } from 'rxjs';
import { StripeScriptTag } from 'stripe-angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'EventFinder';
  subscription: Subscription;
  showLogin = false;
  private stripeKey: string = 'pk_test_Kp4h7o8GaPdZqlJHxPJsjhYO00TCw9sHWP'

  constructor(private shared: SharedService, public StripeScriptTag: StripeScriptTag) {
    this.StripeScriptTag.setPublishableKey(this.stripeKey);
   }

  ngOnInit() {
    this.subscription = this.shared.getLoginValue()
      .subscribe((item: boolean) => this.showLogin = item);
  }
}
