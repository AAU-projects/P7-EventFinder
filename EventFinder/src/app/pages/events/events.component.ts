import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {
  subscription: Subscription;
  showSelectEvent = false;

  constructor(private shared: SharedService) { }

  ngOnInit() {
    this.subscription = this.shared.getShowEventValue()
      .subscribe((item: boolean) => this.showSelectEvent = item);
  }

  showEventSelect() {
    this.shared.showEvent(true);
  }
}
