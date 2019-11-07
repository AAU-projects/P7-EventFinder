import { Component, OnInit, Input, HostListener } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AngularFireFunctions } from '@angular/fire/functions';
import { StripeCheckoutLoader, StripeCheckoutHandler } from 'ng-stripe-checkout';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  private stripeCheckoutHandler: StripeCheckoutHandler;
  @Input() eventPrice: number;
  @Input() organizerImage: string;
  @Input() eventTitle: string;

  constructor(private stripeCheckoutLoader: StripeCheckoutLoader) { }

  ngOnInit() {
    this.stripeCheckoutLoader.createHandler({
      key: 'pk_test_Kp4h7o8GaPdZqlJHxPJsjhYO00TCw9sHWP',
    }).then((handler: StripeCheckoutHandler) => {
        this.stripeCheckoutHandler = handler;
    });
  }

  public onClickBuy() {
    this.stripeCheckoutHandler.open({
        image: this.organizerImage,
        name: this.eventTitle,
        description: 'Giv os alle dine penge',
        amount: this.eventPrice * 100,
        currency: 'DDK',
    }).then((token) => {
        // Do something with the token...
        console.log('Payment successful!', token);
    }).catch((err) => {
        // Payment failed or was canceled by user...
        if (err !== 'stripe_closed') {
            throw err;
            console.log('Error!');
        }
    });
  }

  public onClickCancel() {
    // If the window has been opened, this is how you can close it:
    this.stripeCheckoutHandler.close();
  }
}
