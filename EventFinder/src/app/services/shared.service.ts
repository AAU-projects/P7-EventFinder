import { Injectable, Input, Output, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  @Output() loginEvent: EventEmitter<boolean> = new EventEmitter();
  @Output() showEventEvent: EventEmitter<boolean> = new EventEmitter();

  constructor() { }

  showLogin(value: boolean) {
    this.loginEvent.emit(value);
  }

  showEvent(value: boolean) {
    this.showEventEvent.emit(value);
  }

  getLoginValue() {
    return this.loginEvent;
  }

  getShowEventValue() {
    return this.showEventEvent;
  }
}
