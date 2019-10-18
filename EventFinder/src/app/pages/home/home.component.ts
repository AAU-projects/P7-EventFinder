import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { SharedService } from 'src/app/services/shared.service';
import { EventService } from 'src/app/services/event.service';
import { StorageService } from 'src/app/services/storage.service';
import { Genre, Atmosphere, Dresscode } from 'src/app/models/event.model';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  file: any = null;
  constructor(private shared: SharedService, private events: EventService, private storage: StorageService) { }

  ngOnInit() {
  }

  openLogin() {
    this.shared.changeLogin(true);
  }

  create() {
    this.events.createEvent({
      organizerId: 'j0DFU9mDO1cTE8fC5VJiVDnfk502',
      title: 'Eebz Returns xx The Gap',
      address: 'Jomfru Ane Gade 9',
      zip: '9000',
      city: 'Aalborg',
      country: 'Danmark',
      age: 18,
      price: 0,
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      startDate: new Date('September 6, 2019, 23:00:00 UTC').toISOString(),
      endDate: new Date(Date.UTC(2019, 9, 7, 3, 0)).toISOString(),
      banner: this.file,
      genre: [Genre.Pop, Genre.Disco],
      genreCostum: [ ],
      atmosphere: [Atmosphere.Underground, Atmosphere.LivePerformance],
      atmosphereCustom: [],
      dresscode: Dresscode.Smart ,
    });
  }

  handleFileInput(event) {
    this.file = this.storage.uploadEventBanner(event, 'TestEvent');
  }
}
