import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { EventService } from 'src/app/services/event.service';
import { AccountService } from 'src/app/services/account.service';
import { Event } from 'src/app/models/event.model';
import { FeedbackService } from 'src/app/services/feedback.service';

@Component({
  selector: 'app-add-feedback',
  templateUrl: './add-feedback.component.html',
  styleUrls: ['./add-feedback.component.scss']
})
export class AddFeedbackComponent implements OnInit {
  @Input() event: Event;
  @Input() toggle;
  @Output() closeform = new EventEmitter<boolean>();

  rating = [false, false, false, false, false];
  givenRating: number;
  review: '';

  constructor(private account: AccountService, private feedback: FeedbackService) { }

  ngOnInit() {
  }

  rate(index) {
    const rating = [];

    for (let i = 0; i < 5; i++) {
      if (i <= index) {
        rating.push(true);
      } else {
        rating.push(false);
      }
    }

    this.rating = rating;
    this.givenRating = index + 1;
  }

  getChars() {
    return this.review !== undefined ? this.review.length : 0;
  }

  submit() {
    this.feedback.addFeedback({
      useruid: this.account.baseUser.uid,
      eventuid: this.event.uid,
      organizationuid: this.event.organizationId,
      review: this.review,
      rating: this.givenRating,
      created: new Date().toISOString(),
      uid: ''
    });
    this.close();

  }

  checkValidity() {
    return !(this.review && this.givenRating);
  }

  close() {
    this.closeform.emit(true);
  }

}
