import { Component, OnInit } from '@angular/core';
import { EventService } from 'src/app/services/event.service';
import { AngularFirestore, QueryFn } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { Event } from '../../models/event.model';
import { match } from 'minimatch';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {
  eventList: Event[] = null;
  tagSearchResult: string[];
  currentTagSearchResult: string[];
  eventsTagList: string[];

  eventListSubject: BehaviorSubject<Event[]> = new BehaviorSubject<Event[]>(null);
  public eventListObs: Observable<Event[]> = this.eventListSubject.asObservable();

  constructor(
    public eventService: EventService,
    public afs: AngularFirestore,
    public shared: SharedService
  ) {
    const eventList = [];

    this.eventService.getEvents().subscribe(elist => {
      elist.forEach(e => eventList.push(e.payload.doc.data() as Event));
      this.eventList = eventList;
      this.retrieveTagsForEvents();
    });
  }

  ngOnInit() {}

  async search(input) {
    const eventList = [];
    this.eventService
      .getEventsBySearch(input.toLowerCase())
      .subscribe(elist => {
        elist.forEach(e => eventList.push(e.payload.doc.data() as Event));
        this.eventList = eventList;
        this.retrieveTagsForEvents();
      });
  }

  addTagToEventList(tag) {
    if (tag !== null && tag !== '' && !(this.eventsTagList.includes(tag.toLowerCase()))) {
      this.eventsTagList.push(tag.toLowerCase());
    }
  }

  retrieveTagsForEvents() {
    this.eventsTagList = [];
    for (const event of this.eventList) {
      for (const genre of event.genre) {
        this.addTagToEventList(genre);
      }
      for (const atmosphere of event.atmosphere) {
        this.addTagToEventList(atmosphere);
      }
      this.addTagToEventList(event.atmosphereCustom);
      this.addTagToEventList(event.dresscode);
    }

  }

  getEventIndexInList(event: Event) {
    return this.eventList.indexOf(event) + 1;
  }

  setTagSearchDropdownItems(searchInput) {
    this.currentTagSearchResult = [];
    if (searchInput === '') {
      return;
    }

    for (const tag of this.eventsTagList) {
      if (tag.includes(searchInput)) {
        this.currentTagSearchResult.push(tag);
      }
    }
    console.log(this.currentTagSearchResult);
  }
}
