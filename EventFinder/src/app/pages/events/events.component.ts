import { Component, OnInit } from '@angular/core';
import { EventService } from 'src/app/services/event.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Event } from '../../models/event.model';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {
  eventList: Event[];

  eventListSubject: BehaviorSubject<Event[]> = new BehaviorSubject<Event[]>(null);
  public eventListObs: Observable<Event[]> = this.eventListSubject.asObservable();

  constructor(public eventService: EventService) {
    this.eventList = [];
    this.eventService.getEventsTwo().subscribe(elist => elist.forEach(e => this.eventList.push(e.payload.doc.data() as Event)));
  }

  ngOnInit() {}
}
