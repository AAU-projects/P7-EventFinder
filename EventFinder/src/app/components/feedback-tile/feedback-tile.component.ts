import { Component, OnInit, Input } from '@angular/core';
import { Feedback } from 'src/app/models/feedback.model';
import { Event } from 'src/app/models/event.model';
import { User, Organization } from 'src/app/models/account.model';
import { EventService } from 'src/app/services/event.service';
import { OrganizationService } from 'src/app/services/organization.service';
import { AccountService } from 'src/app/services/account.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-feedback-tile',
  templateUrl: './feedback-tile.component.html',
  styleUrls: ['./feedback-tile.component.scss']
})
export class FeedbackTileComponent implements OnInit {
  @Input() showMetadata = false;
  @Input() feedback: Feedback;

  event: Event;
  user: User;
  organization: Organization;
  userImageUrl: string;

  constructor(private eventService: EventService,
              private orgService: OrganizationService,
              private accountService: AccountService,
              public storage: StorageService) { }

  ngOnInit() {
    const esub = this.eventService.getEvent(this.feedback.eventuid).valueChanges().subscribe(event => {
      this.event = event;
      esub.unsubscribe();
    });

    const orgsub = this.orgService.getOrganization(this.feedback.organizationuid).subscribe(org => {
      this.organization = org;
      orgsub.unsubscribe();
    });

    const usub = this.accountService.getUserFromUid(this.feedback.useruid).subscribe(user => {
      this.user = user;
      const isub = this.storage.getImageUrl(user.profileImage).subscribe(path => {
        this.userImageUrl = path;
        isub.unsubscribe();
      });
      usub.unsubscribe();
    });
  }

  ratings(): boolean[] {
    const ratings = [];
    for (let index = 1; index <= 5; index++) {
      if (index <= this.feedback.rating) {
        ratings.push(true);
      } else {
        ratings.push(false);
      }
    }
    return ratings;
  }

}
