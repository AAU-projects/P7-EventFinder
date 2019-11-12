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
  eventListShow: Event[] = null;
  selectedTagsSearch: string[] = [];
  currentTagSearchResult: string[] = [];
  eventsTagList: string[] = [];
  userLocation: number[] = [null, null];
  maxDistance = 0;

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
      this.applyFilter();
      this.retrieveTagsForEvents();
    });
  }

  ngOnInit() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.userLocation[0] = position.coords.latitude;
      this.userLocation[1] = position.coords.longitude;
    });
  }

  async search(input) {
    const eventList = [];
    this.eventService
      .getEventsBySearch(input.toLowerCase())
      .subscribe(elist => {
        elist.forEach(e => eventList.push(e.payload.doc.data() as Event));
        this.eventList = eventList;
        this.applyFilter();
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
      console.log(this.getInRange(event, this.userLocation, 2));
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
  }

  onTagSelected(tag) {
    if (!(this.selectedTagsSearch.includes(tag.trim()))) {
      this.selectedTagsSearch.push(tag.trim());
    }
    (document.getElementById('tagSearchBar') as HTMLFormElement).value = '';
    this.setTagSearchDropdownItems('');
    this.applyFilter();
  }

  unselectTag(tag) {
    this.selectedTagsSearch.splice(tag, 1);
    this.applyFilter();
  }

  applyDistanceFilter(eventlist: Event[]) {
    for (const event of eventlist) {
      if (!(this.getInRange(event, this.userLocation, this.maxDistance))) {
        eventlist = eventlist.splice(eventlist.indexOf(event), 1);
      }
    }
    return eventlist;
  }

  applyFilter() {
    let tempEventListShow: Event[] = this.eventList;

    tempEventListShow = this.applyTagsFilter(tempEventListShow);
    // tempEventListShow = this.applyDistanceFilter(tempEventListShow);

    this.eventListShow = tempEventListShow;
    console.log(this.eventList);
  }


  private applyTagsFilter(tempEventListShow: Event[]) {
    if (this.selectedTagsSearch.length === 0 ) {
      return tempEventListShow;
    }
    for (const event of this.eventList) {
      const allElements = (event.genre as string[]).concat(event.atmosphere as string[]);
      allElements.push(event.dresscode);
      if (event.atmosphereCustom !== null && event.atmosphereCustom !== "") {
        allElements.push(event.atmosphereCustom);
      }
      tempEventListShow = this.removeEventIfListNotContainsElement(event, tempEventListShow, allElements);
    }
    return tempEventListShow;
  }

  toLowerCase(value) {
    if (value === null || value === undefined) {
      return null;
    } else {
      return value.toLowerCase();
    }
  }

  private removeEventIfListNotContainsElement(event: Event, tempEventListShow, list: string[]) {
    console.log(list);
    let foundElement = false;
    for (const element of list) {
      if (!this.selectedTagsSearch.includes(this.toLowerCase(element)) && (tempEventListShow.includes(event))) {
        foundElement = true;
        break;
      }
    }
    if (!foundElement) {
      tempEventListShow = tempEventListShow.slice(tempEventListShow.indexOf(event), 1);
    }
    return tempEventListShow;
  }

  getInRange(event: Event, userLoc: number[], maxrange: number) {
    const dist = Math.sqrt(Math.pow(userLoc[0] - event.latitude, 2) + Math.pow(userLoc[1] - event.longitude, 2)) * 71.95;
    console.log(dist);
    if (dist > maxrange) {
      return false;
    }
    return true;
  }

  getMaxEventPrice() {
    let maxvalue = 0;
    for (const event of this.eventListShow) {
      if (event.price > maxvalue) {
        maxvalue = event.price;
      }
    }
    return maxvalue;
  }

  distanceUpdate(value) {
    this.maxDistance = value;
  }
}
