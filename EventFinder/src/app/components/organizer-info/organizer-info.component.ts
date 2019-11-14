import { Component, OnInit, Input } from '@angular/core';
import { Organizer } from 'src/app/models/account.model';
import { Event } from 'src/app/models/event.model';
import { EventService } from 'src/app/services/event.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-organizer-info',
  templateUrl: './organizer-info.component.html',
  styleUrls: ['./organizer-info.component.scss']
})
export class OrganizerInfoComponent implements OnInit {
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
