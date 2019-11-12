import { Component, OnInit, HostListener, EventEmitter, Input, Output } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';
import { EventService } from 'src/app/services/event.service';
import { Event } from 'src/app/models/event.model';
import { OrganizationService } from 'src/app/services/organizer.service';
import { Organization } from 'src/app/models/account.model';
import { GoogleMapsService } from 'src/app/services/google-map.service';
import { StorageService } from 'src/app/services/storage.service';

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
  event: Event;
  organizer: Organization;
  logoImage;
  bannerImage;
  @Input() inputEventID;
  @Output() closeEvent = new EventEmitter<string>();

  latitude: number;
  longitude: number;

  constructor(
    public shared: SharedService,
    private apiService: GoogleMapsService,
    private eventService: EventService,
    private organizerService: OrganizationService,
    private storageService: StorageService
  ) {
  }

  ngOnInit() {
    this.loadEvent(this.inputEventID);
  }

  loadOrganizer() {
    this.organizerService
      .getOrganization(this.event.organizerId)
      .subscribe(document => {
        this.organizer = document;
        this.organizerLoaded = Promise.resolve(true);
        this.loadLogo();
      });
  }

  loadEvent(eventid) {
    this.eventService
      .getEvent(eventid)
      .valueChanges()
      .subscribe(document => {
        this.event = document;
        this.eventLoaded = Promise.resolve(true);
        this.updateMap();
        this.loadBanner();
        this.loadOrganizer();
      });
  }

  loadBanner() {
    this.storageService
      .getImageUrl(this.event.banner)
      .subscribe(document => {
        this.bannerImage = document;
        this.bannerLoaded = Promise.resolve(true);
      });
  }

  loadLogo() {
    this.storageService
      .getImageUrl(this.organizer.profileImage)
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
    this.closeEvent.emit('closeEvent');
    //this.shared.showEvent(null);
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
