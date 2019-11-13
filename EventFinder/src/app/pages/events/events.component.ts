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
  maxDistance = Number.MAX_SAFE_INTEGER;
  maxPrice = Number.MAX_SAFE_INTEGER;

  eventListSubject: BehaviorSubject<Event[]> = new BehaviorSubject<Event[]>(null);
  public eventListObs: Observable<Event[]> = this.eventListSubject.asObservable();
  selectedToDateFilter: Date = null;
  selectedFromDateFilter: Date = null;

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
    }
  }

  getEventIndexInList(event: Event) {
    return this.eventListShow.indexOf(event) + 1;
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

  applyFilter() {
    let tempEventListShow: Event[] = Array.from(this.eventList);
    tempEventListShow = tempEventListShow.filter(element => this.applyTagsFilter(element));
    tempEventListShow = tempEventListShow.filter(element => this.getInRange(element, this.userLocation, this.maxDistance));
    tempEventListShow = tempEventListShow.filter(element => element.price <= this.maxPrice);
    tempEventListShow = tempEventListShow.filter(element => this.filterDates(element));

    this.eventListShow = tempEventListShow;
    console.log(this.eventListShow);
  }

  private isDateNull(date) {
    console.log(date === null || String(date) === 'Invalid Date');
    return date === null || String(date) === 'Invalid Date';
  }

  private filterDates(element: Event) {
    const startDate = new Date(element.startDate);
    const endDate = new Date(element.endDate);
    startDate.setHours(1);
    endDate.setHours(1);

    if (this.isDateNull(this.selectedFromDateFilter) && this.isDateNull(this.selectedToDateFilter)) {
      return true;
    } else if (!this.isDateNull(this.selectedFromDateFilter) && this.isDateNull(this.selectedToDateFilter)) {
      if (startDate.getTime() >= this.selectedFromDateFilter.getTime()) {
        return true;
      }

    } else if (this.isDateNull(this.selectedFromDateFilter) && !this.isDateNull(this.selectedToDateFilter)) {
      if (startDate.getTime() <= this.selectedToDateFilter.getTime()) {
        return true;
      }
    } else {
      if (((startDate.getTime() >= this.selectedFromDateFilter.getTime() && startDate.getTime() <= this.selectedToDateFilter.getTime())
        || (endDate.getTime() >= this.selectedFromDateFilter.getTime() && endDate.getTime() <= this.selectedToDateFilter.getTime()))) {
        return true;
      }
    }
    return false;
  }

  private applyTagsFilter(element) {
    if (this.selectedTagsSearch.length === 0 ) {
      return true;
    }
    const allElements = (element.genre as string[]).concat(element.atmosphere as string[]);
    allElements.push(element.dresscode);
    if (element.atmosphereCustom !== null && element.atmosphereCustom !== '') {
      allElements.push(element.atmosphereCustom);
    }

    for (const tag of allElements) {
      if (this.selectedTagsSearch.includes(this.toLowerCase(tag))) {
        return true;
      }
    }
    return false;
  }

  toLowerCase(value) {
    if (value === null || value === undefined) {
      return null;
    } else {
      return value.toLowerCase();
    }
  }

  getInRange(event: Event, userLoc: number[], maxrange: number) {
    const dist = Math.sqrt(Math.pow(userLoc[0] - event.latitude, 2) + Math.pow(userLoc[1] - event.longitude, 2)) * 71.95;
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
    if (value === 50) {
      value = Number.MAX_SAFE_INTEGER;
    }
    this.maxDistance = value;
    this.applyFilter();
  }

  priceUpdate(value) {
    if (value === 10000) {
      value = Number.MAX_SAFE_INTEGER;
    }
    this.maxPrice = value;
    this.applyFilter();
  }

  toDateUpdate(value) {
    this.selectedToDateFilter = new Date(value);
    this.applyFilter();
  }

  fromDateUpdate(value) {
    this.selectedFromDateFilter = new Date(value);
    this.applyFilter();
  }

}
