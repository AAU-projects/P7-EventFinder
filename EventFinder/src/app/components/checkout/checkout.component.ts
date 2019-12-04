import { Component, OnInit, Input} from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { StripeCheckoutLoader, StripeCheckoutHandler } from 'ng-stripe-checkout';
import { CheckoutService } from 'src/app/services/checkout.service';
import { SharedService } from 'src/app/services/shared.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Event as Ev } from 'src/app/models/event.model';
import { Organization } from 'src/app/models/account.model';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  private stripeCheckoutHandler: StripeCheckoutHandler;

  @Input() organizationImage: string;
  @Input() sizeClass: string;
  @Input() event: Ev;
  @Input() organization: Organization;
  @Input() receiptUrl: string;

  paymentDate = new Date(Date.now());
  transactionId: string;
  leaveFeedback = false;

  showConfirmModalSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public showConfirmModalObs: Observable<boolean> = this.showConfirmModalSubject.asObservable();

  constructor(
    private stripeCheckoutLoader: StripeCheckoutLoader,
    public authService: AuthService,
    private shared: SharedService,
    private checkoutService: CheckoutService,
    private firestore: AngularFirestore) {}

  ngOnInit() {
    this.stripeCheckoutLoader.createHandler({
      key: 'pk_test_Kp4h7o8GaPdZqlJHxPJsjhYO00TCw9sHWP',
    }).then((handler: StripeCheckoutHandler) => {
        this.stripeCheckoutHandler = handler;
    });
  }

  private noPaymentReceived() {
    const eventRef = this.firestore.firestore.collection('events').doc(this.event.uid);

    const transaction = this.firestore.firestore.runTransaction(t => {
      return t.get(eventRef)
        .then(doc => {
          const ticketNotSold = doc.data().ticketsSold - 1;
          t.update(eventRef, {ticketsSold: ticketNotSold});
        });
    }).then(result => {
      console.log('Transaction canceled!');
      return true;
    }).catch(err => {
      console.log('Transaction failure:', err);
      return false;
    });
  }

  private checkIfAvailable() {
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
      console.log('Transaction started!');
      this.executePayment();
      return true;
    }).catch(err => {
      console.log('Transaction failure:', err);
      return false;
    });
  }

  public onClickBuy() {
    this.checkIfAvailable();
  }

  private executePayment() {
    if (this.authService.user) {
      this.stripeCheckoutHandler.open({
        image: this.organizationImage,
        name: this.event.title,
        description: this.organization.organization,
        amount: this.event.price * 100,
        currency: 'DKK',
      }).then((token) => {
        // When stripe token is recieved a payment is created in the database
        this.checkoutService.createPayment(token, this.event.price * 100, this.event.uid);
        this.transactionId = token.id;
        this.showConfirmModalSubject.next(true);
      }).catch((err) => {
        // Payment failed or was canceled by user...
        this.noPaymentReceived();
        if (err !== 'stripe_closed') {
          throw err;
        }
      });
    }
    else {
      this.shared.showLogin(true);
    }
  }

  public onClickCancel() {
    this.stripeCheckoutHandler.close();
  }

  exitConfirmModal() {
    this.showConfirmModalSubject.next(false);
  }

  onClickReceipt(event: Event) {
    event.stopPropagation();
    window.open(this.receiptUrl);
  }

  onLeaveFeedback(event: Event) {
    event.stopPropagation();
    this.leaveFeedback = true;
  }

  onCloseFromFeedback() {
    this.leaveFeedback = false;
  }
}
