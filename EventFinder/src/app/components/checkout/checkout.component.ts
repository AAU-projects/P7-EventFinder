import { Component, Input} from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { Event as Ev } from 'src/app/models/event.model';
import { Organization } from 'src/app/models/account.model';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent {

  @Input() organizationImage: string;
  @Input() sizeClass: string;
  @Input() event: Ev;
  @Input() organization: Organization;
  @Input() receiptUrl: string;

  paymentDate = new Date(Date.now());
  leaveFeedback = false;

  constructor(
    public authService: AuthService,
    public checkoutService: CheckoutService,
    private firestore: AngularFirestore) {}


  public onClickBuy() {
    this.checkoutService.createHandler(this.organization, this.event, this.organizationImage);
    this.checkoutService.checkIfAvailable();
  }

  public onClickCancel() {
    this.checkoutService.closeHandler();
  }

  exitConfirmModal() {
    this.checkoutService.showConfirmModalSubject.next(false);
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
