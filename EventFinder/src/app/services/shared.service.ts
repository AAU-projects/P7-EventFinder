import { Injectable, Input, Output, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  @Output() loginEvent: EventEmitter<boolean> = new EventEmitter();

  constructor() { }

  changeLogin(value: boolean) {
    this.loginEvent.emit(value);
  }

  getLoginValue() {
    return this.loginEvent;
  }
}
