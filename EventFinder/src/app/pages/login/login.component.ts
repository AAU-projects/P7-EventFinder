import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Location } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loginForm: FormGroup;
  errorMessage?: string;

  // TwoStateButton
  width = '500px';
  options = {optionOne: 'User', optionTwo: 'Organizer'};
  actions = {actionOne: this.authService.setUserType, actionTwo: this.authService.setOrganizerType};

  constructor(
    public authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private location: Location
  ) {
    this.createForm();
   }

  createForm() {
    this.loginForm = this.fb.group({
      email: ['', Validators.required ],
      password: ['', Validators.required]
    });
  }

  login(value) {
    this.authService.login(value.email, value.password)
    .then(res => {
      this.errorMessage = null;
      this.router.navigate(['/user']);
    }, err => {
      console.log(err);
      this.errorMessage = err.message;
    });
  }

  cancel() {
    this.location.back();
  }

  closeErrorMessage() {
    this.errorMessage = null;
  }
}
