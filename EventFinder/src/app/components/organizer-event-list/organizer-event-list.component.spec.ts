import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizerEventListComponent } from './organizer-event-list.component';

describe('OrganizerEventListComponent', () => {
  let component: OrganizerEventListComponent;
  let fixture: ComponentFixture<OrganizerEventListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganizerEventListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizerEventListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
