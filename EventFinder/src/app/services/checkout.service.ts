import { Injectable, OnDestroy, HostListener } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { AuthService } from './auth.service';
import { EventService } from './event.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { StripeCheckoutLoader, StripeCheckoutHandler } from 'ng-stripe-checkout';
import { SharedService } from './shared.service';
import { Organization } from '../models/account.model';
import { Event as Ev } from 'src/app/models/event.model';


@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  constructor(
    private firestore: AngularFirestore,
    private authService: AuthService,
    private eventService: EventService,
    private stripeCheckoutLoader: StripeCheckoutLoader,
    private shared: SharedService,
  ) {}

  private stripeCheckoutHandler: StripeCheckoutHandler;

  organization: Organization;
  organizationImage: string;
  event: Ev;

  transactionActive: boolean;
  transactionId: string;
  transactionUniqueId: string;

  showConfirmModalSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public showConfirmModalObs: Observable<boolean> = this.showConfirmModalSubject.asObservable();

  createHandler(organization, event, organizationImage) {
    this.organization = organization;
    this.organizationImage = organizationImage;
    this.event = event;
    this.stripeCheckoutLoader.createHandler({
      key: 'pk_test_Kp4h7o8GaPdZqlJHxPJsjhYO00TCw9sHWP',
    }).then((handler: StripeCheckoutHandler) => {
        this.stripeCheckoutHandler = handler;
    });
  }

  closeHandler() {
    this.stripeCheckoutHandler.close();
  }

  createPayment(token: any, amount, eventId) {
    const paymentId = this.firestore.createId();
    const payment = { token, amount, eventId };

    const paymentRef = this.firestore
      .collection(`/payments/${this.authService.user.uid}/userPayments/`)
      .doc(paymentId);
    paymentRef.set(payment, { merge: true });

    return paymentId;
  }

  public executePayment() {
    if (this.authService.user) {
      this.stripeCheckoutHandler.open({
        image: this.organizationImage,
        name: this.event.title,
        description: this.organization.organization,
        amount: this.event.price * 100,
        currency: 'DKK',
      }).then((token) => {
        this.firestore.firestore.collection('paymentsTemp').doc(this.transactionUniqueId).get().then((snapshot) => {
          if (snapshot.exists) {
            // When stripe token is recieved a payment is created in the database
            this.createPayment(token, this.event.price * 100, this.event.uid);
            this.transactionId = token.id;
            this.showConfirmModalSubject.next(true);
            this.firestore.firestore.collection('paymentsTemp').doc(this.transactionUniqueId).delete();
          } else {
            throw new Error('Timeout');
          }
        }).catch((err) => {
            alert('Your payment session has timed out. Please try again.');
        });
      }).catch((err) => {
        // Payment failed or was canceled by user...

        if (err !== 'stripe_closed') {
          throw err;
        }

      });
    } else {
      this.shared.showLogin(true);
    }
  }

  public checkIfAvailable() {
    const eventRef = this.firestore.firestore.collection('events').doc(this.event.uid);

    const transaction = this.firestore.firestore.runTransaction(t => {
      return t.get(eventRef)
        .then(doc => {
          const newTicketSold = doc.data().ticketsSold + 1;
          if (newTicketSold > doc.data().ticketsAvailable) {

            this.event.ticketsSold = this.event.ticketsAvailable;
            throw new Error('Sold out');
          }
          t.update(eventRef, {ticketsSold: newTicketSold});
        });
    }).then(result => {
      this.transactionUniqueId = this.generateID();
      this.firestore.firestore.collection('paymentsTemp').doc(this.transactionUniqueId).set({eventId: this.event.uid});

      this.transactionActive = true;
      this.executePayment();
      return true;
    }).catch(err => {
      return false;
    });
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

  generateID() {
    return '_' + Math.random().toString(36).substr(2, 9);
  }
}
