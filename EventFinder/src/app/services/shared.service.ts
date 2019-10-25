import { Injectable, Input, Output, EventEmitter } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { EventModel } from '../models/event.model';
import { HttpClient } from '@angular/common/http';
import { MapStyles } from 'src/assets/mapStyles';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  @Output() loginEvent: EventEmitter<boolean> = new EventEmitter();
  @Output() showEventEvent: EventEmitter<string> = new EventEmitter();
  @Output() isLoading: EventEmitter<boolean> = new EventEmitter();
  public maptheme;
  public selectedEvent: string;

  constructor() {
    const ms = new MapStyles();
    this.maptheme = ms.get_darkTheme();
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
}
