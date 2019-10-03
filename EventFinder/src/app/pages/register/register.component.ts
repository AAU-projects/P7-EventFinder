import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { UserTypes } from 'src/app/models/user.types.enum';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

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
  localUserType: UserTypes = UserTypes.User;

  // Two State Button
  width = '500px';
  height = '20px';
  options = {optionOne: 'User', optionTwo: 'Organizer'};
  actions = {actionOne: this.setToUser, actionTwo: this.setToOrganizer};

  constructor(
    public auth: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private firestore: AngularFirestore
  ) {
    this.createForm(this.auth.type);
  }

  setToUser() {
    this.localUserType = UserTypes.User;
    this.auth.setUserType();
  }

  setToOrganizer() {
    this.localUserType = UserTypes.Organizer;
    this.auth.setOrganizerType();
  }

  createForm(type: UserTypes) {
    this.registerForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      name: ['', Validators.required],
      zip: ['', Validators.required],
      country: ['', Validators.required],
      phone: ['', Validators.required]
    });

    if (type === UserTypes.User) {
      this.registerForm.addControl('firstname', new FormControl(Validators.required));
      this.registerForm.addControl('lastname', new FormControl(Validators.required));
      this.registerForm.addControl('birthday', new FormControl(Validators.required));
      this.registerForm.addControl('sex', new FormControl(Validators.required));
    } else if (type === UserTypes.Organizer) {
      this.registerForm.addControl('address', new FormControl(Validators.required));
      this.registerForm.addControl('organization', new FormControl(Validators.required));
    }
  }

  register(value) {
    this.auth.register(value)
    .then(res => {
      this.router.navigate(['/user']);
    }, err => {
      this.errorMessage = err.message;
      this.successMessage = '';
    });
  }


}
