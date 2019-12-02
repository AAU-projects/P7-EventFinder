import { Component, OnInit } from '@angular/core';
import { EventService } from 'src/app/services/event.service';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFirestore, QueryFn } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { Event } from '../../models/event.model';
import { match } from 'minimatch';
import { SharedService } from 'src/app/services/shared.service';
import { AccountService } from 'src/app/services/account.service';
import { RecommenderService } from 'src/app/services/recommender.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {
  eventList: Event[] = [];
  eventListShow: Event[] = null;
  selectedTagsSearch: string[] = [];
  currentTagSearchResult: string[] = [];
  eventsTagList: string[] = [];
  userLocation: number[] = [null, null];
  maxDistance = Number.MAX_SAFE_INTEGER;
  maxPrice = Number.MAX_SAFE_INTEGER;

  selectedToDateFilter: Date = null;
  selectedFromDateFilter: Date = null;

    constructor(
    public eventService: EventService,
    public afs: AngularFirestore,
    public shared: SharedService,
    public auth: AuthService,
    public accountService: AccountService,
    public recommenderService: RecommenderService
  ) {
    if (accountService.currentUser) {
      this.recommenderService.eventListObs.subscribe(events => {
        this.eventList = events;
        if (this.eventList === null) {
          return;
        }
        this.applyFilter();
        this.retrieveTagsForEvents();
      });
    } else {
      this.eventService.getEvents().subscribe(elist => {
        this.eventList = [];
        elist.forEach(e => this.eventList.push(e.payload.doc.data() as Event));
        this.applyFilter();
        this.retrieveTagsForEvents();
      });
    }
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
        if (this.accountService.currentUser !== null) {
          this.eventList = this.sortByRecommended(eventList);
        }
        this.applyFilter();
        this.retrieveTagsForEvents();
      });
  }
  sortByRecommended(events: any[]) {
    const weightMap = this.accountService.baseUser.recommendedWeights;
    let eventScoreMap: any = [];
    events.forEach((event: any) => {
      let score = 0;

      const genre = event.genre;
      const atmosphere = event.atmosphere;
      const dresscode = event.dresscode;
      const allElements = genre.concat(atmosphere);
      allElements.push(dresscode);

      // Caculates score for an event
      allElements.forEach((element: any) => {
        const name = element.toLowerCase();
        if (name in weightMap) {
          score += Number(weightMap[name]) / allElements.length;
        }
      });

      eventScoreMap.push([event, score]);
    });
    eventScoreMap = eventScoreMap.sort((a: any, b: any) => b[1] - a[1]);
    const eventsList = [];
    eventScoreMap.forEach((event: any) => {
      eventsList.push(event[0]);
    });
    return eventsList;
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
    if (this.eventList === null) {
      return;
    }
    let tempEventListShow: Event[] = Array.from(this.eventList);
    tempEventListShow = tempEventListShow.filter(element => this.applyTagsFilter(element));
    tempEventListShow = tempEventListShow.filter(element => this.getInRange(element, this.userLocation, this.maxDistance));
    tempEventListShow = tempEventListShow.filter(element => element.price <= this.maxPrice);
    tempEventListShow = tempEventListShow.filter(element => this.filterDates(element));

    this.eventListShow = tempEventListShow;
  }

  private isDateNull(date) {
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
