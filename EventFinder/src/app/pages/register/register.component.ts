import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { UserTypes } from 'src/app/models/user.types.enum';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { RegExValidator } from 'src/app/directives/regEx.directive';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  get UserTypes() { return UserTypes; }
  registerForm: FormGroup;
  errorMessage = '';
  successMessage = '';

  // Two State Button
  width = '500px';
  options = {optionOne: 'User', optionTwo: 'Organizer'};
  actions = {actionOne: this.auth.setUserType, actionTwo: this.auth.setOrganizerType};

  constructor(
    public auth: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private firestore: AngularFirestore,
    private shared: SharedService
  )  {
    this.shared.changeLogin(false);
    this.createForm(this.auth.userType);
    this.auth.isUserObs.subscribe();
  }

  setToUser() {
    console.log('SET TO USER');
    this.auth.setUserType();
    this.createForm(this.auth.userType);
  }

  setToOrganizer() {
    console.log('SET TO ORGANIZER');
    this.auth.setOrganizerType();
    this.createForm(this.auth.userType);
  }

  createForm(userType: UserTypes) {
    if (userType === UserTypes.User) {
      this.registerForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
        zip: ['', [Validators.required, RegExValidator(/^[0-9]{4}$/i)]],
        city: ['', [Validators.required, Validators.minLength(3), RegExValidator(/[a-z, ,A-Z,ÆæØøÅå]*/i)]],
        country: ['', [Validators.required, Validators.minLength(3), RegExValidator(/[a-z, ,A-Z,ÆæØøÅå]*/i)]],
        phone: ['', [Validators.required, RegExValidator(/^[0-9]{8}$/i)]],
        firstname: ['', [Validators.required, Validators.minLength(2), RegExValidator(/[a-z, ,A-Z, ÆæØøÅå]*/i)]],
        lastname: ['', [Validators.required, Validators.minLength(2), RegExValidator(/[a-z, ,A-Z,ÆæØøÅå]*/i)]],
        birthday: ['', [Validators.required]],
        sex: ['', [Validators.required]]
      });
    } else {
      this.registerForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
        zip: ['', [Validators.required, RegExValidator(/^[0-9]{4}$/i)]],
        city: ['', [Validators.required, Validators.minLength(3), RegExValidator(/[a-z, ,A-Z,ÆæØøÅå]*/i)]],
        country: ['', [Validators.required, Validators.minLength(3), RegExValidator(/[a-z, ,A-Z,ÆæØøÅå]*/i)]],
        phone: ['', [Validators.required, RegExValidator(/^[0-9]{8}$/i)]],
        address: ['', [Validators.required, Validators.minLength(3), RegExValidator(/[a-z, ,A-Z,ÆæØøÅå,0-9]*/i)]],
        organization: ['', [Validators.required, Validators.minLength(3), RegExValidator(/[a-z, ,A-Z,ÆæØøÅå,0-9]*/i)]]
      });
    }
  }

  register(value) {
    console.log('REGISTER USER CALLED');
    this.auth.register(value)
    .then(res => {
      this.router.navigate(['/user']);
    }, err => {
      this.errorMessage = err.message;
      console.log(err.message);
      this.successMessage = '';
    });
  }
}
