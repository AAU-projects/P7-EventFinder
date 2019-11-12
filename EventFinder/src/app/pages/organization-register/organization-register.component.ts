import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RegExValidator } from 'src/app/directives/regEx.directive';
import { GoogleMapsService } from 'src/app/services/google-map.service';
import { SharedService } from 'src/app/services/shared.service';
import { StorageService } from 'src/app/services/storage.service';
import { Organization } from 'src/app/models/account.model';
import { AuthService } from 'src/app/services/auth.service';
import { OrganizationService } from 'src/app/services/organizer.service';
import { AccountService } from 'src/app/services/account.service';
import { AccountTypes } from 'src/app/models/account.types.enum';

@Component({
  selector: 'app-organization-register',
  templateUrl: './organization-register.component.html',
  styleUrls: ['./organization-register.component.scss']
})
export class OrganizationRegisterComponent implements OnInit {
  get AccountTypes() { return AccountTypes; }

  errorMsg: string;
  registerForm: FormGroup;
  profileImage;
  showTagPopUp = false;

  constructor(
    private fb: FormBuilder,
    private mapsService: GoogleMapsService,
    public shared: SharedService,
    private storage: StorageService,
    private auth: AuthService,
    private org: OrganizationService,
    private account: AccountService) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      zip: ['', [Validators.required, RegExValidator(/^[0-9]{4}$/i)]],
      city: ['', [Validators.required, Validators.minLength(3), RegExValidator(/[a-z, ,A-Z,ÆæØøÅå]*/i)]],
      country: ['', [Validators.required, Validators.minLength(3), RegExValidator(/[a-z, ,A-Z,ÆæØøÅå]*/i)]],
      phone: ['', [Validators.required, RegExValidator(/^[0-9]{8}$/i)]],
      address: ['', [Validators.required, Validators.minLength(3), RegExValidator(/[a-z, ,A-Z,ÆæØøÅå,0-9]*/i)]],
      organization: ['', [Validators.required, Validators.minLength(3), RegExValidator(/[a-z, ,A-Z,ÆæØøÅå,0-9]*/i)]],
      about: ['', []],
      profileImage: ['', []],
      connectedUsers: ['', []]
    });
  }

  ngOnInit() {
  }

  register(value: Organization) {
    if (!this.profileImage) {
      this.errorMsg = 'You must upload an organization logo';
      return;
    }

    this.registerForm.controls.profileImage.setValue('EventFinder/logo.png');
    this.registerForm.controls.connectedUsers.setValue(this.auth.user.uid);

    const orgUid = this.org.createOrgnization(value);
    this.org.setLogo(this.uploadLogo(orgUid));
    this.account.addOrganization(orgUid);
    this.showTagPopUp = true;
  }

  selectProfileImage(image: File) {
    const reader: FileReader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = () => {
      this.profileImage = reader.result;
      this.shared.showCropper(true);
    };
  }

  uploadLogo(uid) {
    if (this.profileImage) {
      return this.storage.uploadOrgLogo(this.profileImage, 'profileimage', uid);
    } else {
      return 'EventFinder/logo.png';
    }
  }

  getImage(image: string) {
    this.profileImage = image;
  }

  findInformationfromZip(value) {
    const status = 'status';
    const results = 'results';
    const addressComponents = 'address_components';
    const longName = 'long_name';
    const cityInput = 'city';
    const countryInput = 'country';

    this.mapsService.get_city_from_zip(value).subscribe(result => {
      if (result[status] !== 'ZERO_RESULTS') {
        const city = result[results][0][addressComponents][1][longName];
        const country = result[results][0][addressComponents].pop()[longName];

        this.registerForm.controls[cityInput].setValue(city);
        this.registerForm.controls[countryInput].setValue(country);
      }
    });
  }

  aboutEnterFix($event: KeyboardEvent) {
    $event.stopPropagation();
  }
}
