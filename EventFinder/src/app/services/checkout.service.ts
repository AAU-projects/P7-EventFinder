import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  constructor(private firestore: AngularFirestore, private authService: AuthService) { }

  createPayment(token: any, amount, eventId) {
    const paymentId = this.firestore.createId();
    const payment = { token, amount, eventId};

    const paymentRef = this.firestore.collection(`/payments/${this.authService.user.uid}/userPayments/`).doc(paymentId);
    paymentRef.set(payment, {merge: true});

    return paymentId;
  }

  getOrderedEventsForUser(userId) {
    this.firestore.collection(`/payments/${userId}/userPayments`).snapshotChanges().forEach(doc => {
      doc.forEach(payment => {
        const eventId = payment.payload.doc.data.eventId;
      });
    });
  }
}
