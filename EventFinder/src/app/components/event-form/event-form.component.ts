import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { RegExValidator } from 'src/app/directives/regEx.directive';
import { EventService } from 'src/app/services/event.service';
import { AuthService } from 'src/app/services/auth.service';
import { Dresscode, Genre, Atmosphere } from 'src/app/models/event.model';
import { StorageService } from 'src/app/services/storage.service';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { GoogleMapsService } from 'src/app/services/google-map.service';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss'],
  animations: [
    trigger('simpleFadeAnimation', [

      state('in', style({opacity: 1})),

      transition(':enter', [
        style({opacity: 0}),
        animate(600)
      ]),

      transition(':leave',
        animate(600, style({opacity: 0})))
    ])
  ]
})
export class EventFormComponent implements OnInit {

  get Dresscode() { return Dresscode; }
  get Genre() { return Genre; }
  get Atmosphere() { return Atmosphere; }

  eventForm: FormGroup;
  genreList: Genre[];
  atmosList: Atmosphere[];
  bannerFilePath = '';
  bannerFileName: string;
  bannerEvent: any;
  notificationMessage = '';
  notificationClass = '';

  showNotificationSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  showNotificationObs: Observable<boolean> = this.showNotificationSubject.asObservable();

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private authService: AuthService,
    private storageService: StorageService,
    private router: Router,
    private mapsService: GoogleMapsService,
  ) {
    this.createForm();
    this.genreList = [];
    this.atmosList = [];
   }

  ngOnInit() {
  }

  createForm() {
    this.eventForm = this.fb.group({
      uid: ['', []],
      searchTerms: ['', []],
      organizerId: this.authService.user.uid,
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      startTime: ['', [Validators.required]],
      endTime: ['', [Validators.required]],
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      banner: ['', []],
      genre: ['', []],
      atmosphere: ['', []],
      atmosphereCustom: ['', []],
      dresscode: ['', [Validators.required]],
      address: ['', [Validators.required]],
      zip: ['', [Validators.required, RegExValidator(/^[0-9]{4}$/i)]],
      city: ['', [Validators.required, Validators.minLength(3), RegExValidator(/[a-z, ,A-Z,ÆæØøÅå]*/i)]],
      country: ['', [Validators.required, Validators.minLength(3), RegExValidator(/[a-z, ,A-Z,ÆæØøÅå]*/i)]],
      age: ['', [Validators.required, RegExValidator(/^[0-9]*$/i)]],
      price: ['', [Validators.required, RegExValidator(/^[0-9]*$/i)]]
    });
  }

  createEvent(value) {

    value.atmosphere = this.atmosList;
    value.genre = this.genreList;
    value.banner = this.bannerFilePath;

    value.startDate = this.convertDateTime(value.startDate, value.startTime);
    value.endDate = this.convertDateTime(value.endDate, value.endTime);

    this.UploadBanner();
    value.banner = this.bannerFilePath;

    const searchArray: string[] = [];

    searchArray.push(value.city.toLowerCase());
    const titleSplit = value.title.split(' ');
    for (const subString of titleSplit) {
      if (!(subString in searchArray)) {
        searchArray.push(subString.toLowerCase());
      }
    }
    console.log(searchArray);
    value.searchTerms = searchArray;
    const id = this.eventService.createEvent(value);

    if (id === null) {
      this.notificationClass = 'is-warning';
      this.notificationMessage = 'Something went wrong when creating the event...';
      this.showNotificationSubject.next(true);
    } else {
      this.eventService.updateEvent(id, {uid: id});
      this.resetForm();
      this.notificationClass = 'is-primary';

      // TODO: Insert link to created event in the HTML string below.
      this.notificationMessage = 'Successfully created the event:<strong> '
        + value.title + '</strong>.<br>If you wish to navigate to your event, click <a>here</a>.';
      this.showNotificationSubject.next(true);
    }
  }

  resetForm() {
    this.eventForm.reset();
    this.atmosList.length = 0;
    this.genreList.length = 0;
  }

  checkDate() {
    const startDate = this.eventForm.value.startDate;
    const startTime = this.eventForm.value.startTime;
    const endDate = this.eventForm.value.endDate;
    const endTime = this.eventForm.value.endTime;

    if (startDate && startTime && endDate && endTime) {
      if (new Date(this.convertDateTime(startDate, startTime)) > new Date(this.convertDateTime(endDate, endTime))) {
        this.notificationClass = 'is-warning';
        this.notificationMessage = 'Start date can not be after end date.';
        this.showNotificationSubject.next(true);
        return true;
      } else {
        this.showNotificationSubject.next(false);
        return false;
      }
    }
  }

  convertDateTime(inputDate, inputTime) {
    const date = new Date(inputDate);
    const timeString = inputTime.toString();
    date.setHours(timeString.split(':')[0]);
    date.setMinutes(timeString.split(':')[1]);
    return date.toISOString();
  }

  onFileInputChanged(event) {
    this.bannerFileName = event.target.files.item(0).name;
    this.bannerEvent = event;
  }

  UploadBanner() {
    this.bannerFilePath = this.storageService.uploadEventBanner(this.bannerEvent, this.bannerFileName);
  }

  onGenreClick(genre: Genre) {
    if (this.genreList.includes(genre)) {
      this.genreList.splice(this.getListIndex(genre, this.genreList), 1);
    } else {
      this.genreList.push(genre);
    }
  }

  onAtmosClick(atmos: Atmosphere) {
    if (this.atmosList.includes(atmos)) {
      this.atmosList.splice(this.getListIndex(atmos, this.atmosList), 1);
    } else {
      this.atmosList.push(atmos);
    }
  }

  getListIndex(text: string, list: string[]): number {
    for (let i = 0; i < list.length; i++) {
      if (list[i] === text) {
        return i;
      }
    }
    return 0;
  }

  findInformationfromZip(value) {
    this.mapsService.get_city_from_zip(value).subscribe(result => {
      if (result['status'] !== 'ZERO_RESULTS') {
        const city = result['results'][0]['address_components'][1]['long_name'];
        const country = result['results'][0]['address_components'].pop()['long_name'];

        this.eventForm.controls['city'].setValue(city);
        this.eventForm.controls['country'].setValue(country);
      }
    });
  }
}
