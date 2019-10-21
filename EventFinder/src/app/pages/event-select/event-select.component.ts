import { Component, OnInit, HostListener } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';
import { HttpClient } from '@angular/common/http';
import { EventService } from 'src/app/services/event.service';
import { AngularFirestoreDocument } from '@angular/fire/firestore';

@Component({
  selector: 'app-event-select',
  templateUrl: './event-select.component.html',
  styleUrls: ['./event-select.component.scss']
})
export class EventSelectComponent implements OnInit {
  location = null;
  latitude = 0;
  longitude = 0;

  constructor(private shared: SharedService, private httpClient: HttpClient, private eventService: EventService) {
    eventService.getEvent('QIZxLor0x7MnONTLN0Bi').then((result) => {
      this.event = result;
    });
    this.httpClient.get(this.apiAddress()).subscribe(result => {
      this.location = result['results'][0]['geometry']['location'];
      console.log(result['results'][0]['geometry']['location']);
      this.latitude = this.location['lat'];
      this.longitude = this.location['lng'];
    });
  }

  ngOnInit() {}

  apiAddress() {
    return 'https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=AIzaSyAxJpRUrMbG264kgpMZNhk916zvqP1K08U'
  }

  close() {
    this.shared.showEvent(false);
  }

  getEventTitleDescription() {
    return 'Lorem ipsum dolor sit amet';
  }

  getEventDescription() {
    return (
      'Consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.' +
      '\n\n Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.' +
      '\n\n Lorem ipsum dolor sit amet Consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.'
    );
  }

  getOrganizerDescription() {
    return ('');
  }

  getLocation() {
    return 'Musikkens Pl. 1, 9000 Aalborg';
  }

  getDate() {
    return 'September 7th, 2019 from 16:30 - 18:30';
  }

  getTitle() {
    return 'A Conversation with President Barack Obama';
  }

  @HostListener('document:keydown', ['$event']) onKeydownHandler(
    event: KeyboardEvent
  ) {
    if (event.key === 'Escape') {
      this.close();
    }
  }
}
