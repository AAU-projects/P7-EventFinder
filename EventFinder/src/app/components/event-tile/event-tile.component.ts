import { Component, OnInit, Input } from '@angular/core';
import { Event } from '../../models/event.model';
import { StorageService } from 'src/app/services/storage.service';
import { OrganizerService } from 'src/app/services/organizer.service';
import { Organization } from 'src/app/models/account.model';

@Component({
  selector: 'app-event-tile',
  templateUrl: './event-tile.component.html',
  styleUrls: ['./event-tile.component.scss']
})
export class EventTileComponent implements OnInit {

  public event: Event;
  @Input() inputEvent: Event;
  public organizer: Organization;
  public allAtmosphere: string[];
  public bannerUrl;
  public organizerImageUrl;
  public description: string;
  private descriptionMaxLength = 300;
  public selectedEventID = null;
  rawEndDate: string;
  rawStartDate: string;

  public formattedDate: string;

  constructor(private storageService: StorageService,
              private organizerService: OrganizerService) {
    this.allAtmosphere = [];
  }

  ngOnInit() {
    // Get event from input.
    this.event = this.inputEvent;
    this.organizerService.getOrganizer(this.event.organizerId).valueChanges().subscribe((org) => {
      this.organizer = org;
      this.storageService.getImageUrl(this.organizer.profileImage).subscribe((url) => {
        this.organizerImageUrl = url;
      });
    });

    // Get atmospheres.
    this.event.atmosphere.forEach(atmosphere => {
      this.allAtmosphere.push(atmosphere);
    });
    if (this.event.atmosphereCustom) {
      this.allAtmosphere.push(this.event.atmosphereCustom);
    }

    // Get image url for banner.
    this.storageService.getImageUrl(this.event.banner).subscribe(url => this.bannerUrl = url);


    // Get and shorten description.
    if (this.event.description.length > this.descriptionMaxLength) {
      this.description = this.event.description.substring(0, this.descriptionMaxLength - 3) + '...';
    } else {
      this.description = this.event.description;
    }
    this.rawStartDate = this.event.startDate.toString().slice(0, 10);
    this.rawEndDate = this.event.endDate.toString().slice(0, 10);
  }

  selectInfoscreenEventHandler(event) {
    if (event === 'closeEvent') {
      this.setSelectedEvent(null);
    }
  }

  setSelectedEvent(eventID) {
    this.selectedEventID = eventID;
  }
}
