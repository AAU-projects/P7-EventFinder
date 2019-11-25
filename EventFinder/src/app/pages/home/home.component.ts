import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';
import { EventService } from 'src/app/services/event.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  file: any = null;
  constructor(private shared: SharedService, private events: EventService, private storage: StorageService) { }

  ngOnInit() {
  }
}
