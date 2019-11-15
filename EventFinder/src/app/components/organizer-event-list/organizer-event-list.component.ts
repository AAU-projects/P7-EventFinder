import { Component, OnInit, Input } from '@angular/core';
import { EventService } from 'src/app/services/event.service';
import { Organizer } from 'src/app/models/account.model';
import { Event } from 'src/app/models/event.model';


@Component({
  selector: 'app-organizer-event-list',
  templateUrl: './organizer-event-list.component.html',
  styleUrls: ['./organizer-event-list.component.scss']
})
export class OrganizerEventListComponent implements OnInit {
  @Input() user: Organizer;
  orgEventList: Event[] = [];

  constructor(private eventService: EventService) {}

  ngOnInit() {
    this.eventService.getEvents(100).subscribe(result => {
      for (const collection of result) {
        const event = collection.payload.doc.data() as Event;

        if (event.organizerId === this.user.uid) {
          this.orgEventList.push(event);
        }
      }
    });
  }

}
