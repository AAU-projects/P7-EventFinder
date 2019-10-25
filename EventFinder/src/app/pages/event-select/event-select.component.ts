import { Component, OnInit, HostListener, EventEmitter } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';
import { EventService } from 'src/app/services/event.service';
import { AngularFirestoreDocument } from '@angular/fire/firestore';
import { EventModel } from 'src/app/models/event.model';
import { Subscription } from 'rxjs';
import { OrganizerService } from 'src/app/services/organizer.service';
import { Organizer } from 'src/app/models/account.model';
import { ApiService } from 'src/app/services/api.service';
import { StorageService } from 'src/app/services/storage.service';
import { stringify } from '@angular/compiler/src/util';
import { isEmpty } from 'rxjs/operators';

@Component({
  selector: 'app-event-select',
  templateUrl: './event-select.component.html',
  styleUrls: ['./event-select.component.scss']
})
export class EventSelectComponent implements OnInit {
  eventLoaded: Promise<boolean>;
  organizerLoaded: Promise<boolean>;
  logoLoaded: Promise<boolean>;
  bannerLoaded: Promise<boolean>;
  event: EventModel;
  organizer: Organizer;
  logoImage;
  bannerImage;

  latitude: number;
  longitude: number;

  constructor(
    public shared: SharedService,
    private apiService: ApiService,
    private eventService: EventService,
    private organizerService: OrganizerService,
    private storageService: StorageService
  ) {
    this.loadEvent(this.shared.selectedEvent);
    this.loadOrganizer();
  }

  ngOnInit() {}

  loadOrganizer() {
    this.organizerService
      .getOrganizer('sG0L32ksrVfS7k95fTe6LWZi6Z53')
      .valueChanges()
      .subscribe(document => {
        this.organizer = document;
        this.organizerLoaded = Promise.resolve(true);
      });
  }

  loadEvent(eventid) {
    this.eventService
      .getEvent(eventid)
      .valueChanges()
      .subscribe(document => {
        this.event = document;
        this.updateMap();
        this.eventLoaded = Promise.resolve(true);
        this.loadLogo();
        this.loadBanner();
      });
  }

  loadBanner() {
    this.storageService
      .getImageUrl(this.event.banner) // change this to organizer.banner when it works :)
      .subscribe(document => {
        this.bannerImage = document;
        this.bannerLoaded = Promise.resolve(true);
      });
  }

  loadLogo() {
    this.storageService
      .getImageUrl('images/sG0L32ksrVfS7k95fTe6LWZi6Z53/profileimage.png') // change this to organizer.profileimage when it works :)
      .subscribe(document => {
        this.logoImage = document;
        this.logoLoaded = Promise.resolve(true);
      });
  }

  updateMap() {
    this.apiService.get_location(this.formatAddress()).subscribe(result => {
      const results = 'results';
      const geometry = 'geometry';
      const location = 'location';
      const lat = 'lat';
      const lng = 'lng';

      const loc = result[results][0][geometry][location];
      this.latitude = loc[lat];
      this.longitude = loc[lng];
    });
  }

  formatAddress() {
    return this.event.address.replace(' ', '+');
  }

  close() {
    this.shared.showEvent(null);
  }

  getEventTitleDescription() {
    return this.event.title;
  }

  getEventDescription() {
    return this.event.description;
  }

  getOrganizerDescription() {
    return this.organizer.about;
  }

  getLocation() {
    return this.event.address + ', ' + this.event.city;
  }

  getAge() {
    return this.event.age + '+';
  }

  getDate() {
    const monthNames = [
      'January',
      'Febuary',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ];

    const newDateStartString = new Date(this.event.startDate);
    const newDateEndString = new Date(this.event.endDate);
    const monthName = monthNames[newDateStartString.getMonth()];

    const startHour = this.timeFormat(newDateStartString.getHours());
    const startMinute = this.timeFormat(newDateStartString.getMinutes());
    const endHour = this.timeFormat(newDateEndString.getHours());
    const endMinute = this.timeFormat(newDateEndString.getMinutes());

    return (
      `${monthName} ${this.dayFormat(newDateStartString.getDay())}, ` +
      `${newDateStartString.getFullYear()} from ` +
      `${startHour}:${startMinute} ` +
      `to ${endHour}:${endMinute}`
    );
  }

  timeFormat(time) {
    if (time === 0) {
      return '00';
    }
    return time;
  }

  dayFormat(day) {
    switch (day) {
      case 1: {
        return `${day}st`;
      }
      case 2: {
        return `${day}nd`;
      }
      case 3: {
        return `${day}rd`;
      }
      default: {
        return `${day}th`;
      }
    }
  }

  getTitle() {
    return this.event.title;
  }

  getPrice() {
    return this.event.price + 'DKK';
  }

  displayList(list) {
    let result = '';
    list.forEach(element => {
      if (element != null) {
        result += ` ${element} |`;
      }
    });

    return result.slice(0, -1);
  }

  getGenre() {
    return this.displayList(this.event.genre);
  }

  getAtmosphere() {
    if (!(this.event.atmosphereCustom === '')) {
      return (
        this.displayList(this.event.atmosphere) +
        '|' +
        this.event.atmosphereCustom
      );
    }

    return this.displayList(this.event.atmosphere);
  }

  getDresscode() {
    return this.event.dresscode;
  }

  @HostListener('document:keydown', ['$event']) onKeydownHandler(
    event: KeyboardEvent
  ) {
    if (event.key === 'Escape') {
      this.close();
    }
  }
}
