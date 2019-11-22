import { Component, OnInit, Input } from '@angular/core';
import { Event as Ev} from '../../models/event.model' ;
import { StorageService } from 'src/app/services/storage.service';
import { OrganizationService } from 'src/app/services/organization.service';
import { Organization } from 'src/app/models/account.model';

@Component({
  selector: 'app-event-tile',
  templateUrl: './event-tile.component.html',
  styleUrls: ['./event-tile.component.scss']
})
export class EventTileComponent implements OnInit {

  public event: Ev;
  @Input() inputEvent: Ev;
  @Input() markerIndex: number;
  @Input() receiptUrl: string; // Only used when show in the user profile page.
  public organization: Organization;
  public allAtmosphere: string[];
  public bannerUrl;
  public organizationImageUrl;
  public description: string;
  private descriptionMaxLength = 300;
  public selectedEventID = null;
  rawEndDate: string;
  rawStartDate: string;

  public formattedDate: string;

  constructor(private storageService: StorageService,
              private organizationService: OrganizationService) {
    this.allAtmosphere = [];
  }

  ngOnInit() {
    // Get event from input.
    this.event = this.inputEvent;

    const sub = this.organizationService.getOrganization(this.event.organizationId).subscribe(org => {
      this.organization = org;
      if (org) {
        const isub = this.storageService.getImageUrl(this.organization.profileImage).subscribe(url => {
          this.organizationImageUrl = url;
          isub.unsubscribe();
          sub.unsubscribe();
        });
      }
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

  stopit(event: Event) {
    event.stopImmediatePropagation();
  }
}
