import { Component, OnInit, Input } from '@angular/core';
import { Event } from 'src/app/models/event.model';
import { User, Organization } from 'src/app/models/account.model';
import { AccountTypes } from 'src/app/models/account.types.enum';
import { FeedbackService } from 'src/app/services/feedback.service';
import { Feedback } from 'src/app/models/feedback.model';
import { Subject, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-feedback-list-tile',
  templateUrl: './feedback-list-tile.component.html',
  styleUrls: ['./feedback-list-tile.component.scss']
})
export class FeedbackListTileComponent implements OnInit {
  @Input() event: Event;
  @Input() user: User;
  @Input() organization: Organization;
  @Input() editable = false;

  feedback: Feedback[];
  editFeedbacks = [];
  pages = [undefined];
  page = new Subject<string>();
  resultlist: Observable<Feedback[]>;
  feedbacksPerPage = 5;

  constructor(private feedbackService: FeedbackService) { }

  ngOnInit() {
    if (this.event) {
      this.resultlist = this.page.pipe(switchMap(uid => this.feedbackService
        .getFeedbackFromEvent(this.event.uid, this.feedbacksPerPage + 1, uid)));
    } else if (this.user) {
      this.resultlist = this.page.pipe(switchMap(uid => this.feedbackService
        .getFeedbackFromUser(this.user.uid, this.feedbacksPerPage + 1, uid)));
    } else {
      this.resultlist = this.page.pipe(switchMap(uid => this.feedbackService
        .getFeedbackFromOrganization(this.organization.uid, this.feedbacksPerPage + 1, uid)));
    }

    this.resultlist.subscribe(list => {
      this.feedback = list;
    });
    this.page.next(undefined);
  }

  onNextClick() {
    this.pages.push(this.feedback[0].created);
    this.page.next(this.feedback[this.feedbacksPerPage].created);
  }

  onPreviousClick() {
    this.page.next(this.pages.pop());
  }

  feedbackListFunc() {
    if (this.feedback.length === this.feedbacksPerPage + 1) {
      return this.feedback.slice(0, this.feedback.length - 1);
    } else {
      return this.feedback;
    }
  }

}
