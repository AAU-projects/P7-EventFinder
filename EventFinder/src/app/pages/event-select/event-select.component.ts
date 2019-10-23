import { Component, OnInit, HostListener, EventEmitter } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';
import { HttpClient } from '@angular/common/http';
import { EventService } from 'src/app/services/event.service';
import { AngularFirestoreDocument } from '@angular/fire/firestore';
import { EventModel } from 'src/app/models/event.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-event-select',
  templateUrl: './event-select.component.html',
  styleUrls: ['./event-select.component.scss']
})
export class EventSelectComponent implements OnInit {
  subscription: Subscription;
  isLoading: EventEmitter<boolean> = new EventEmitter();
  value: boolean;
  APIKEY = 'AIzaSyAxJpRUrMbG264kgpMZNhk916zvqP1K08U';

  location = null;
  latitude = 0;
  longitude = 0;
  event: EventModel = null;

  constructor(
    public shared: SharedService,
    private httpClient: HttpClient,
    private eventService: EventService
  ) {
    this.isLoading.emit(true);
    const event: AngularFirestoreDocument<EventModel> = eventService.getEvent(
      'P35r5dDvnLbcwzYdwsyc'
    );
    event.valueChanges().subscribe(document => {
      console.log(document);
      this.event = document;
      this.updateMap();
      this.isLoading.emit(false);
      console.log(this.isLoading);
    });
  }

  getIsLoading() {
    this.isLoading.subscribe(res => {
      this.value = res;
    });
  }

  ngOnInit() {

  }

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
      'https://maps.googleapis.com/maps/api/geocode/json?address=' +
      this.formatAddress() + '&key=' + this.APIKEY
    );
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
    const monthName = monthNames[newDateStartString.getMonth()];

    return (
      `${monthName} ${this.dayFormat(newDateStartString.getDay())},` +
      `${newDateStartString.getFullYear()} from ${newDateStartString.getHours()}:${newDateStartString.getMinutes()} to ${newDateEndString.getHours()}:${newDateEndString.getMinutes()}`
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

  // Move this sometwhere else :O)
  styles: [] = [
    {
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#212121"
        }
      ]
    },
    {
      "elementType": "labels.icon",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#212121"
        }
      ]
    },
    {
      "featureType": "administrative",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "featureType": "administrative.country",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9e9e9e"
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "administrative.locality",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#bdbdbd"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#181818"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#616161"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#1b1b1b"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#2c2c2c"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#8a8a8a"
        }
      ]
    },
    {
      "featureType": "road.arterial",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#373737"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#3c3c3c"
        }
      ]
    },
    {
      "featureType": "road.highway.controlled_access",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#4e4e4e"
        }
      ]
    },
    {
      "featureType": "road.local",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#616161"
        }
      ]
    },
    {
      "featureType": "transit",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#000000"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#3d3d3d"
        }
      ]
    }
  ]
}
