import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize, retry } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  downloadURL: Observable<string>;

  constructor(private storage: AngularFireStorage, private auth: AuthService) {

  }

  uploadEventBanner(event, fileName) {
    return this.uploadFile(event, `events/${this.auth.user.uid}/${fileName}`);
  }

  uploadFile(event, location) {
    const file = event.target.files[0];
    const filePath = location;
    this.storage.upload(filePath, file);
    return location;
  }

  getImageUrl(location) {
    return this.storage.ref(location).getDownloadURL();
  }

}
