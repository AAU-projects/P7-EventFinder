import { Component, OnInit, HostListener } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-event-select',
  templateUrl: './event-select.component.html',
  styleUrls: ['./event-select.component.scss']
})
export class EventSelectComponent implements OnInit {

  constructor(
    private shared: SharedService
  ) { }

  ngOnInit() {
  }

  close() {
    this.shared.showEvent(false);
  }

  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.close();
    }
  }
}
