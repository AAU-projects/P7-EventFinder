import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Payment } from '../models/payment.model';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  constructor(private firestore: AngularFirestore) { }

  createPayment(values) {
    const id = this.firestore.createId();
    const paymentRef = this.firestore.collection('payments').doc<Payment>(id);

    paymentRef.set(values);

    return id;
  }
}
