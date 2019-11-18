import { Component, OnInit, Input } from '@angular/core';
import { EventService } from 'src/app/services/event.service';
import { Organization } from 'src/app/models/account.model';
import { Event } from 'src/app/models/event.model';


@Component({
  selector: 'app-organization-event-list',
  templateUrl: './organization-event-list.component.html',
  styleUrls: ['./organization-event-list.component.scss']
})
export class OrganizationEventListComponent implements OnInit {
  @Input() user: Organization;
  orgEventList: Event[] = [];

  constructor(private eventService: EventService) {}

  ngOnInit() {
    this.eventService.getEvents(100).subscribe(result => {
      for (const collection of result) {
        const event = collection.payload.doc.data() as Event;

        if (event.organizationId === this.user.uid) {
          this.orgEventList.push(event);
        }
      }
    });
  }

}
