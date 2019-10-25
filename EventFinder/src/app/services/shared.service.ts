import { Injectable, Input, Output, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  @Output() showCropperEvent: EventEmitter<boolean> = new EventEmitter();
  @Output() loginEvent: EventEmitter<boolean> = new EventEmitter();

  constructor() {
    this.showCropper(false);
  }

  changeLogin(value: boolean) {
    this.loginEvent.emit(value);
  }

  getLoginValue() {
    return this.loginEvent;
  }

  showCropper(value: boolean) {
    this.showCropperEvent.emit(value);
  }
}
