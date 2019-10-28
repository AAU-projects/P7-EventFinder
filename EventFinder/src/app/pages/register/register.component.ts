import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router, Event } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountTypes } from 'src/app/models/account.types.enum';
import { RegExValidator } from 'src/app/directives/regEx.directive';
import { SharedService } from 'src/app/services/shared.service';
import { StorageService } from 'src/app/services/storage.service';
import { GoogleMapsService } from 'src/app/services/google-map.service';

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
  showTagPopUp = false;

  constructor(
    public auth: AuthService,
    private router: Router,
    private fb: FormBuilder,
    public shared: SharedService,
    private storage: StorageService,
    private mapsService: GoogleMapsService,
  )  {
    this.shared.showLogin(false);
    this.createForm(this.auth.userType);
    this.auth.isUserObs.subscribe();
  }

  selectProfileImage(image: File) {
    const reader: FileReader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = () => {
      this.profileImage = reader.result;
      this.shared.showCropper(true);
    };
   }

   uploadProfileImage() {
    if (this.profileImage) {
      return this.storage.uploadProfilePicture(this.profileImage, 'profileimage');
    } else {
      return 'EventFinder/logo.png';
    }
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
    if (this.auth.getUserType() === AccountTypes.Organizer) {
      if (!this.profileImage) {
        this.errorMessage = 'You must upload an organization logo';
        this.successMessage = '';
        return;
      }
    }

    this.auth.register(value)
    .then(res => {
      this.auth.setCurrentUserProfileImage(this.uploadProfileImage());
      this.showTagPopUp = true;
    }, err => {
      this.errorMessage = err.message;
      this.successMessage = '';
    });
  }

  findInformationfromZip(value) {
    this.mapsService.get_city_from_zip(value).subscribe(result => {
      if (result['status'] !== 'ZERO_RESULTS') {
        const city = result['results'][0]['address_components'][1]['long_name'];
        const country = result['results'][0]['address_components'][2]['long_name'];

        this.registerForm.controls['city'].setValue(city);
        this.registerForm.controls['country'].setValue(country);
      }
    });
  }
}
