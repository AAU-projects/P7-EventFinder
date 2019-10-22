import { Component, OnInit, HostListener } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';
import { HttpClient } from '@angular/common/http';
import { EventService } from 'src/app/services/event.service';
import { AngularFirestoreDocument } from '@angular/fire/firestore';
import { EventModel } from 'src/app/models/event.model';

@Component({
  selector: 'app-event-select',
  templateUrl: './event-select.component.html',
  styleUrls: ['./event-select.component.scss']
})
export class EventSelectComponent implements OnInit {
  location = null;
  latitude = 0;
  longitude = 0;
  event: EventModel = null;

  constructor(
    public shared: SharedService,
    private httpClient: HttpClient,
    private eventService: EventService
  ) {
    shared.isLoading.subscribe();
    shared.setIsLoading(true);
    const event: AngularFirestoreDocument<EventModel> = eventService.getEvent(
      'KibTDPjICMHdYSvCQoEk'
    );
    event.valueChanges().subscribe(document => {
      console.log(document);
      this.event = document;
      this.updateMap();
      shared.setIsLoading(false);
    });
  }

  ngOnInit() {}

  updateMap() {
    this.httpClient.get(this.apiAddress()).subscribe(result => {
      this.location = result['results'][0]['geometry']['location'];
      console.log(result['results'][0]['geometry']['location']);
      this.latitude = this.location['lat'];
      this.longitude = this.location['lng'];
    });
  }

  apiAddress() {
    return (
      'https://maps.googleapis.com/maps/api/geocode/json?address' +
      '=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=AIzaSyCj6DAd2_FVNu73UmA41f4mjnbfP2Y2NhU'
    );
  }

  close() {
    this.shared.showEvent(false);
  }

  getEventTitleDescription() {
    return this.event.title;
  }

  getEventDescription() {
    return this.event.description;
  }

  getOrganizerDescription() {
    return '';
  }

  getLocation() {
    return this.event.address;
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
    const monthName = monthNames[this.event.startDate.getMonth()];

    return (
      `${monthName} ${this.dayFormat(newDateStartString.getDay())},` +
      `${newDateStartString.getFullYear()} from ${newDateStartString.getTime()} to ${newDateEndString.getTime()}`
    );
  }

  dayFormat(day) {
    switch (day) {
      case 1: {
        return `${day}st`;
        break;
      }
      case 2: {
        return `${day}nd`;
        break;
      }
      case 3: {
        return `${day}rd`;
        break;
      }
      default: {
        return `${day}th`;
        break;
      }
    }
  }

  getTitle() {
    return this.event.title;
  }

  getPrice() {
    return this.event.price;
  }

  getGenre() {
    return this.event.genre;
  }

  @HostListener('document:keydown', ['$event']) onKeydownHandler(
    event: KeyboardEvent
  ) {
    if (event.key === 'Escape') {
      this.close();
    }
  }
}
