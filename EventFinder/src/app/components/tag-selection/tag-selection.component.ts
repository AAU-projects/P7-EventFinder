import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/services/account.service';
import { Tags } from 'src/app/models/account.model';
import { Genre, Atmosphere } from 'src/app/models/event.model';
import { AccountTypes } from 'src/app/models/account.types.enum';
import { NotificationService } from 'src/app/services/notification.service';
import { MAX_UNSIGNED_VALUE } from 'long';

@Component({
  selector: 'app-tag-selection',
  templateUrl: './tag-selection.component.html',
  styleUrls: ['./tag-selection.component.scss']
})
export class TagSelectionComponent implements OnInit {
  @Input() userType: AccountTypes;

  get Tags() { return Tags; }
  get Genre() { return Genre; }
  get Atmosphere() { return Atmosphere; }
  get AccountTypes() { return AccountTypes; }

  tagList: Tags[] = [];
  userPreferenceList: any[] = [];

  errorMsg: string;

  constructor(private router: Router, public accountService: AccountService, private notification: NotificationService) { }

  ngOnInit() {
  }

  cancel() {
    this.router.navigate(['/']);
  }

  confirmSelection() {
    if (this.userType === AccountTypes.User && this.userPreferenceList.length >= 1) {
      this.accountService.editTagsOrPrefrences(this.userPreferenceList);
      this.router.navigate(['/user']);
      this.notification.notifySuccess('You have successfully created your user');
    } else if (this.tagList.length >= 1 && this.tagList.length <= 3) {
      this.accountService.editTagsOrPrefrences(this.tagList);
      this.router.navigate(['/organization']);
      this.notification.notifySuccess('You have successfully created your organization');
    }
  }

  submitCheck() {
    return !(this.tagList.length >= 1 || this.userPreferenceList.length >= 1);
  }

  onTagClick(tag: Tags) {
    if (this.tagList.includes(tag)) {
      this.errorMsg = null;
      this.tagList.splice(this.tagList.indexOf(tag), 1);
    } else if (this.tagList.length >= 3) {
      this.errorMsg = 'You can only select 3 tags';
    } else {
      this.tagList.push(tag);
    }
    console.log(this.tagList);
  }

  onPrefrenceClick(tag: Tags | Genre | Atmosphere) {
    if (this.userPreferenceList.includes(tag)) {
      this.userPreferenceList.splice(this.userPreferenceList.indexOf(tag), 1);
    } else {
      this.userPreferenceList.push(tag);
    }
  }
}
