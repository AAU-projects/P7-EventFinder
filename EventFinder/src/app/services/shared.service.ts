import { Injectable, Input, Output, EventEmitter } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { EventModel } from '../models/event.model';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  @Output() loginEvent: EventEmitter<boolean> = new EventEmitter();
  @Output() showEventEvent: EventEmitter<string> = new EventEmitter();
  @Output() currentEvent: EventEmitter<EventModel> = new EventEmitter();
  @Output() isLoading: EventEmitter<boolean> = new EventEmitter();

  constructor() { }

  setEvent(value: EventModel) {
    this.currentEvent.emit(value);
  }

  getCurrentEvent() {
    return this.currentEvent;
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

  showEvent(value: string) {
    this.showEventEvent.emit(value);
  }

  getLoginValue() {
    return this.loginEvent;
  }

  getShowEventValue() {
    return this.showEventEvent;
  }
}
