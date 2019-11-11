import { Component, OnInit, Input, HostListener } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AngularFireFunctions } from '@angular/fire/functions';
import { StripeCheckoutLoader, StripeCheckoutHandler } from 'ng-stripe-checkout';
import { CheckoutService } from 'src/app/services/checkout.service';
import { SharedService } from 'src/app/services/shared.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Event } from 'src/app/models/event.model';
import { Organizer } from 'src/app/models/account.model';

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

  paymentDate = new Date(Date.now());
  paymentEmail: string;
  transactionId: string;

  showConfirmModalSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public showConfirmModalObs: Observable<boolean> = this.showConfirmModalSubject.asObservable();

  constructor(
    private stripeCheckoutLoader: StripeCheckoutLoader,
    public authService: AuthService,
    private shared: SharedService,
    private checkoutService: CheckoutService) {
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
          currency: 'DDK',
      }).then((token) => {
          const paymentData = {
            eventId: this.event.uid,
            stripeToken: token,
            userId: this.authService.user.uid,
            paymentDate: this.paymentDate.toISOString()
          };
          this.checkoutService.createPayment(paymentData);
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
    // If the window has been opened, this is how you can close it:
    this.stripeCheckoutHandler.close();
  }

  exitConfirmModal() {
    this.showConfirmModalSubject.next(false);
  }
}
