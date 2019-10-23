import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AccountTypes } from 'src/app/models/account.types.enum';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { RegExValidator } from 'src/app/directives/regEx.directive';
import { SharedService } from 'src/app/services/shared.service';
import { ImageToolsService } from 'src/app/services/image-tools.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  get AccountTypes() { return AccountTypes; }
  registerForm: FormGroup;
  errorMessage = '';
  successMessage = '';
  profileImage;

  constructor(
    public auth: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private firestore: AngularFirestore,
    public shared: SharedService,
    private sanitizer: DomSanitizer
  )  {
    this.shared.changeLogin(false);
    this.createForm(this.auth.userType);
    this.auth.isUserObs.subscribe();
  }

  uploadImage(image: File) {
    console.log(image);

    const reader: FileReader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = () => {
      this.profileImage = reader.result;
      this.shared.showCropper(true);
    };
   }

   getImage(image: string) {
     this.profileImage = image;
   }


  setToUser() {
    this.auth.setUserType();
    this.createForm(this.auth.userType);
  }

  setToOrganizer() {
    this.auth.setOrganizerType();
    this.createForm(this.auth.userType);
  }

  createForm(userType: AccountTypes) {
    if (userType === AccountTypes.User) {
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
    this.auth.register(value)
    .then(res => {
      if (this.auth.userType === AccountTypes.User) {
        this.router.navigate(['/user']);
      } else {
      this.router.navigate(['/organizer']);
      }
    }, err => {
      this.errorMessage = err.message;
      this.successMessage = '';
    });
  }
}
