import { Component, HostListener } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Location } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { SharedService } from 'src/app/services/shared.service';
import { AccountTypes } from 'src/app/models/account.types.enum';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loginForm: FormGroup;
  errorMessage?: string;
  rememberMe: boolean;

  constructor(
    public authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private location: Location,
    private cookie: CookieService,
    private shared: SharedService
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
    this.authService.login(value.email, value.password, this.rememberMe, true)
    .then(res => {
      this.errorMessage = null;
      this.shared.changeLogin(false);
      console.log(this.authService.userType);
    }, err => {
      console.log(err);
      this.errorMessage = err.message;
    });
  }

  cancel() {
    this.shared.changeLogin(false);
  }

  closeErrorMessage() {
    this.errorMessage = null;
  }

  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.cancel();
    }

    if (event.key === 'Enter') {
        this.login(this.loginForm.value);
    }
  }
}
