import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageToolsService {

  constructor() { }

  resizeImage(file: File) {
    console.log(file);

  }
}