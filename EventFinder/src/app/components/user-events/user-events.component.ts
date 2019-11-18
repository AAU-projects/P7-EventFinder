import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/models/account.model';
import { Event } from 'src/app/models/event.model';
import { CheckoutService } from 'src/app/services/checkout.service';

@Component({
  selector: 'app-user-events',
  templateUrl: './user-events.component.html',
  styleUrls: ['./user-events.component.scss']
})
export class UserEventsComponent implements OnInit {
  @Input() user: User;
  eventObjects;

  constructor(private checkoutService: CheckoutService) { }

  ngOnInit() {
    this.eventObjects = this.checkoutService.getPurchasedEventsForUser(this.user.uid);
  }

}
