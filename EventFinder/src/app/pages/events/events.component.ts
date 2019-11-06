import { Component, OnInit } from '@angular/core';
import { EventService } from 'src/app/services/event.service';
import { AngularFirestore, QueryFn } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { Event } from '../../models/event.model';
import { match } from 'minimatch';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {
  eventList: Event[];

  eventListSubject: BehaviorSubject<Event[]> = new BehaviorSubject<Event[]>(
    null
  );
  public eventListObs: Observable<
    Event[]
  > = this.eventListSubject.asObservable();

  constructor(public eventService: EventService,
              public afs: AngularFirestore) {
    this.eventList = [];
    this.eventService
      .getEvents()
      .subscribe(elist =>
        elist.forEach(e => this.eventList.push(e.payload.doc.data() as Event))
      );
  }

  ngOnInit() {}

  async search(input) {
    console.log(input);
    const eventList = [];
    this.eventService
      .getEventsBySearch(input.toLowerCase())
      .subscribe(elist =>
        elist.forEach(e => this.eventList.push(e.payload.doc.data() as Event))
      );
    this.eventList = eventList;
    console.log(this.eventList);
  }
}
