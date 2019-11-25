import { Component, OnInit, Input } from '@angular/core';
import { Event } from 'src/app/models/event.model';
import { User, Organization } from 'src/app/models/account.model';
import { AccountTypes } from 'src/app/models/account.types.enum';
import { FeedbackService } from 'src/app/services/feedback.service';
import { Feedback } from 'src/app/models/feedback.model';

@Component({
  selector: 'app-feedback-list-tile',
  templateUrl: './feedback-list-tile.component.html',
  styleUrls: ['./feedback-list-tile.component.scss']
})
export class FeedbackListTileComponent implements OnInit {
  @Input() event: Event;
  @Input() user: User;
  @Input() organization: Organization;

  feedback: Feedback[];

  constructor(private feedbackService: FeedbackService) { }

  ngOnInit() {
    if (this.event) {
      const sub = this.feedbackService.getFeedbackFromEvent(this.event.uid).subscribe(list => {
        this.feedback = list;
        sub.unsubscribe();
      });
    } else if (this.user) {
      const sub = this.feedbackService.getFeedbackFromUser(this.user.uid).subscribe(list => {
        this.feedback = list;
        sub.unsubscribe();
      });
    } else {
      const sub = this.feedbackService.getFeedbackFromOrganization(this.organization.uid).subscribe(list => {
        this.feedback = list;
        sub.unsubscribe();
      });
    }
  }

}
