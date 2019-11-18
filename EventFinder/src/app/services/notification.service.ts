import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  notificationMessage = '';
  notificationClass = '';

  showNotificationSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  showNotificationObs: Observable<boolean> = this.showNotificationSubject.asObservable();

  constructor() { }

  hideNotification() {
    this.showNotificationSubject.next(false);
  }
  notifyError(msg) {
    this.notificationClass = 'is-danger';
    this.notificationMessage = msg;
    this.showNotificationSubject.next(true);
  }

  notifyWarning(msg) {
    this.notificationClass = 'is-warning';
    this.notificationMessage = msg;
    this.showNotificationSubject.next(true);
  }

  notifyInfo(msg) {
    this.notificationClass = 'is-info';
    this.notificationMessage = msg;
    this.showNotificationSubject.next(true);
  }

  notifySuccess(msg) {
    this.notificationClass = 'is-success';
    this.notificationMessage = msg;
    this.showNotificationSubject.next(true);
  }
}
