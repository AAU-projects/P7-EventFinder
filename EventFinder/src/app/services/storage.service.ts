import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private storage: AngularFireStorage) {

  }

  uploadEventBanner(event) {
    return this.uploadFile(event, 'events/test');
  }

  uploadFile(event, location) {
    const file = event.target.files[0];
    const filePath = location;
    const task = this.storage.upload(filePath, file);

    return task;
  }

}
