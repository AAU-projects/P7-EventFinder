import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { Tags } from 'src/app/models/account.model';
import { Genre, Atmosphere } from 'src/app/models/event.model';

@Component({
  selector: 'app-tag-selection',
  templateUrl: './tag-selection.component.html',
  styleUrls: ['./tag-selection.component.scss']
})
export class TagSelectionComponent implements OnInit {
  get Tags() { return Tags; }
  get Genre() { return Genre; }
  get Atmosphere() { return Atmosphere; }

  tagList: Tags[] = [];
  userPreferenceList: any[] = [];

  constructor(private router: Router, public userService: UserService) { }

  ngOnInit() {
  }

  cancel() {
    this.router.navigate(['/']);
  }

  confirmSelection() {
    this.router.navigate(['/']);
  }

  onTagClick(tag: Tags) {
    if (this.tagList.includes(tag)) {
      this.tagList.splice(this.tagList.indexOf(tag), 1);
    } else {
      this.tagList.push(tag);
    }
  }

  onPrefrenceClick(tag: Tags|Genre|Atmosphere) {
    if (this.userPreferenceList.includes(tag)) {
      this.userPreferenceList.splice(this.userPreferenceList.indexOf(tag), 1);
    } else {
      this.userPreferenceList.push(tag);
    }
  }
}
