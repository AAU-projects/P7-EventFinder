import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { RegExValidator } from 'src/app/directives/regEx.directive';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss']
})
export class EventFormComponent implements OnInit {

  eventForm: FormGroup;
  genreList: string[];
  atmosList: string[];
  dressChoice: string;

  constructor(
    private fb: FormBuilder,
  ) {
    this.createForm();
    this.genreList = [];
    this.atmosList = [];
    this.dressChoice = '';
   }

  ngOnInit() {
  }

  createForm() {
    this.eventForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      banner: ['', [Validators.required]],
      genre: ['', [Validators.required]],
      genreCustom: ['', [Validators.required]],
      atmosphere: ['', [Validators.required]],
      atmosphereCustom: ['', [Validators.required]],
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

  }

  onGenreClick(text: string) {
    if (this.genreList.includes(text)) {
      this.genreList.splice(this.getListIndex(text, this.genreList), 1);
    } else {
      this.genreList.push(text);
    }
  }

  onAtmosClick(text: string) {
    if (this.atmosList.includes(text)) {
      this.atmosList.splice(this.getListIndex(text, this.atmosList), 1);
    } else {
      this.atmosList.push(text);
    }
  }

  onDressClick(text: string) {
    this.dressChoice = text;
    console.log(this.dressChoice);
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
