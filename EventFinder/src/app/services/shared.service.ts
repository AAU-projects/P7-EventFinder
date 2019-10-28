import { Injectable, Output, EventEmitter } from '@angular/core';
import { MapStyles } from 'src/assets/mapStyles';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  @Output() showCropperEvent: EventEmitter<boolean> = new EventEmitter();
  @Output() loginEvent: EventEmitter<boolean> = new EventEmitter();
  @Output() showEventEvent: EventEmitter<string> = new EventEmitter();
  @Output() isLoading: EventEmitter<boolean> = new EventEmitter();
  public maptheme;
  public selectedEvent: string;

  constructor() {
    const ms = new MapStyles();
    this.maptheme = ms.get_darkTheme();
    this.showCropper(false);
  }

  setIsloading(value: boolean) {
    this.isLoading.emit(value);
  }

  getIsloading() {
    return this.isLoading;
  }

  showLogin(value: boolean) {
    this.loginEvent.emit(value);
  }

  getLoginValue() {
    return this.loginEvent;
  }

  showEvent(value: string) {
    this.showEventEvent.emit(value);
    this.selectedEvent = value;
  }

  getShowEvent() {
    return this.showEventEvent;
  }

  showCropper(value: boolean) {
  this.showCropperEvent.emit(value);
  }
}
