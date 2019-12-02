import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';
import { EventService } from 'src/app/services/event.service';
import { StorageService } from 'src/app/services/storage.service';
import { FeedbackService } from 'src/app/services/feedback.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  file: any = null;
  feedback = [];
  constructor(private shared: SharedService, private events: EventService, private storage: StorageService, private bob: FeedbackService) {
    this.bob.getFeedbackFromUser('JTHIgizm3wT36WX10SUBffsIaXw2').subscribe(items => {
      this.feedback = items;

    });
  }

  ngOnInit() {
  }
}
