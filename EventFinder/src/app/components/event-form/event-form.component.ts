import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { RegExValidator } from 'src/app/directives/regEx.directive';
import { EventService } from 'src/app/services/event.service';
import { AuthService } from 'src/app/services/auth.service';
import { Dresscode, Genre, Atmosphere } from 'src/app/models/event.model';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss']
})
export class EventFormComponent implements OnInit {

  get Dresscode() { return Dresscode; }
  get Genre() { return Genre; }
  get Atmosphere() { return Atmosphere; }

  eventForm: FormGroup;
  genreList: Genre[];
  atmosList: Atmosphere[];
  dressChoice: Dresscode;
  bannerFilePath = '';
  bannerFileName: string;
  bannerEvent: any;

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private authService: AuthService,
    private storageService: StorageService,
  ) {
    this.createForm();
    this.genreList = [];
    this.atmosList = [];
   }

  ngOnInit() {
  }

  createForm() {
    this.eventForm = this.fb.group({
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
      dresscode: ['', []],
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
    value.dresscode = this.dressChoice;

    value.startDate = this.convertDateTime(value.startDate, value.startTime);
    value.endDate = this.convertDateTime(value.endDate, value.endTime);

    this.UploadBanner();
    value.banner = this.bannerFilePath;
    this.eventService.createEvent(value);
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

  onDressClick(dresscode: Dresscode) {
    this.dressChoice = dresscode;
  }

  getListIndex(text: string, list: string[]): number {
    for (let i = 0; i < list.length; i++) {
      if (list[i] === text) {
        return i;
      }
    }
    return 0;
  }
}
