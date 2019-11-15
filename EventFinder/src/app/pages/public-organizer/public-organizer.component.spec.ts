import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicOrganizerComponent } from './public-organizer.component';

describe('PublicOrganizerComponent', () => {
  let component: PublicOrganizerComponent;
  let fixture: ComponentFixture<PublicOrganizerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicOrganizerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicOrganizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
