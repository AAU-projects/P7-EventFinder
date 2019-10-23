import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageToolsService {

  constructor(private imgTool) { }

  resizeImage(file: File) {
    console.log(file);

    return this.imgTool.resizeImage(file, 128, 128);
  }
}
