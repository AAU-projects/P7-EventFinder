import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  downloadURL: Observable<string>;

  constructor(private storage: AngularFireStorage, private auth: AuthService) {}

  uploadProfilePicture(image, filename) {
    return this.uploadImage(image, `images/${this.auth.user.uid}/${filename}`);
  }

  uploadEventBanner(event, fileName) {
    return this.uploadFileFromEvent(event, `events/${this.auth.user.uid}/${fileName}`);
  }

  uploadFileFromEvent(event, location) {
    const file = event.target.files[0];
    this.storage.upload(location, file);
    return location;
  }

  dataURItoBlob(dataURI) {
    const imageString = atob(dataURI.split(',')[1]);
    const array = [];
    for (let i = 0; i < imageString.length; i++) {
      array.push(imageString.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {
    type: 'image/png'
    });
  }

  uploadImage(image, location) {
    this.storage.upload(location, this.dataURItoBlob(image));
    return location;
  }

  getImageUrl(location) {
    return this.storage.ref(location).getDownloadURL();
  }

}
