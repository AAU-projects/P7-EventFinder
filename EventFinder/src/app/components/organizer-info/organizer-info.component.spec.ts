import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizerInfoComponent } from './organizer-info.component';

describe('OrganizerInfoComponent', () => {
  let component: OrganizerInfoComponent;
  let fixture: ComponentFixture<OrganizerInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganizerInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizerInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
