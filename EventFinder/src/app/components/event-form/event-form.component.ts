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

  constructor(
    private fb: FormBuilder,
  ) {
    this.createForm();
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

}
