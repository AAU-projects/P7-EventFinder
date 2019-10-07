import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { SharedService } from 'src/app/services/shared.service';
@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.scss']
})

export class ForgotpasswordComponent {

  resetForm: FormGroup;

  constructor(
    public authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private cookie: CookieService,
    private shared: SharedService) {
      this.createForm();
   }

   createForm() {
    this.resetForm = this.fb.group({
      email: ['', Validators.required ]
    });
  }

  send_reset_email(value) {
    this.authService.reset_email(value.email);
  }

}
