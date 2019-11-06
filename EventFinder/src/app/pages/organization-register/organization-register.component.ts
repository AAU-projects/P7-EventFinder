import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RegExValidator } from 'src/app/directives/regEx.directive';

@Component({
  selector: 'app-organization-register',
  templateUrl: './organization-register.component.html',
  styleUrls: ['./organization-register.component.scss']
})
export class OrganizationRegisterComponent implements OnInit {
  errorMsg: string = 'test';
  registerForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      zip: ['', [Validators.required, RegExValidator(/^[0-9]{4}$/i)]],
      city: ['', [Validators.required, Validators.minLength(3), RegExValidator(/[a-z, ,A-Z,ÆæØøÅå]*/i)]],
      ountry: ['', [Validators.required, Validators.minLength(3), RegExValidator(/[a-z, ,A-Z,ÆæØøÅå]*/i)]],
      phone: ['', [Validators.required, RegExValidator(/^[0-9]{8}$/i)]],
      address: ['', [Validators.required, Validators.minLength(3), RegExValidator(/[a-z, ,A-Z,ÆæØøÅå,0-9]*/i)]],
      organization: ['', [Validators.required, Validators.minLength(3), RegExValidator(/[a-z, ,A-Z,ÆæØøÅå,0-9]*/i)]]
    });
  }

  ngOnInit() {
  }

  register(value) {
    return;
  }

}
