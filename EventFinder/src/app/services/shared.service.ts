import { Injectable, Input, Output, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  @Output() loginEvent: EventEmitter<boolean> = new EventEmitter();
  @Output() showEventEvent: EventEmitter<boolean> = new EventEmitter();
  @Output() isLoading: EventEmitter<boolean> = new EventEmitter();

  constructor() { }

  setIsLoading(value: boolean) {
    this.isLoading.emit(value);
  }

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
