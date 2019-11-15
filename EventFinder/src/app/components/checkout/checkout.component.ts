import { Component, OnInit, Input, HostListener } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { StripeCheckoutLoader, StripeCheckoutHandler } from 'ng-stripe-checkout';
import { CheckoutService } from 'src/app/services/checkout.service';
import { SharedService } from 'src/app/services/shared.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Event } from 'src/app/models/event.model';
import { Organizer } from 'src/app/models/account.model';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  private stripeCheckoutHandler: StripeCheckoutHandler;

  @Input() organizerImage: string;
  @Input() sizeClass: string;
  @Input() event: Event;
  @Input() organizer: Organizer;
  @Input() receiptUrl: string;

  paymentDate = new Date(Date.now());
  paymentEmail: string;
  transactionId: string;

  showConfirmModalSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public showConfirmModalObs: Observable<boolean> = this.showConfirmModalSubject.asObservable();

  constructor(
    private stripeCheckoutLoader: StripeCheckoutLoader,
    public authService: AuthService,
    private shared: SharedService,
    private checkoutService: CheckoutService,
    public sanitizer: DomSanitizer) {
      this.paymentEmail = this.authService.user.email;
    }

  ngOnInit() {
    this.stripeCheckoutLoader.createHandler({
      key: 'pk_test_Kp4h7o8GaPdZqlJHxPJsjhYO00TCw9sHWP',
    }).then((handler: StripeCheckoutHandler) => {
        this.stripeCheckoutHandler = handler;
    });
  }

  public onClickBuy() {
    if (this.authService.user) {
      this.stripeCheckoutHandler.open({
          image: this.organizerImage,
          name: this.event.title,
          description: this.organizer.organization,
          amount: this.event.price * 100,
          currency: 'DKK',
      }).then((token) => {
          // When stripe token is recieved a payment is created in the database
          this.checkoutService.createPayment(token, this.event.price * 100, this.event.uid);
          this.transactionId = token.id;
          this.showConfirmModalSubject.next(true);
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

  public onClickCancel() {
    this.stripeCheckoutHandler.close();
  }

  exitConfirmModal() {
    this.showConfirmModalSubject.next(false);
  }

  onClickReceipt() {
    window.open(this.receiptUrl);
  }
}
