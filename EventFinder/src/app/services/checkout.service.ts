import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { EventService } from './event.service';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  constructor(
    private firestore: AngularFirestore,
    private authService: AuthService,
    private eventService: EventService
  ) {}

  createPayment(token: any, amount, eventId) {
    const paymentId = this.firestore.createId();
    const payment = { token, amount, eventId };

    const paymentRef = this.firestore
      .collection(`/payments/${this.authService.user.uid}/userPayments/`)
      .doc(paymentId);
    paymentRef.set(payment, { merge: true });

    return paymentId;
  }

  getPurchasedEventsForUser(userId) {
    const eventIdList = [];
    const receipts = {};
    const eventObjects = [];

    this.firestore
      .collection(`/payments/${userId}/userPayments`)
      .snapshotChanges()
      .subscribe(snapshot => {
        snapshot.forEach(doc => {
          eventIdList.push(doc.payload.doc.get('eventId'));
          receipts[doc.payload.doc.get('eventId')] = doc.payload.doc.get(
            'stripeCharge.receipt_url'
          );
        });
        this.eventService.getEvents(500).subscribe(events => {
          events.forEach(event => {
            if (eventIdList.includes(event.payload.doc.get('uid'))) {
              const eventObject = {
                event: event.payload.doc.data() as Event,
                receipt_url: receipts[event.payload.doc.get('uid')]
              };
              eventObjects.push(eventObject);
            }
          });
        });
      });
    return eventObjects;
  }
}
