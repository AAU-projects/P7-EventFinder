import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationEventListComponent } from './organization-event-list.component';

describe('OrganizationEventListComponent', () => {
  let component: OrganizationEventListComponent;
  let fixture: ComponentFixture<OrganizationEventListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganizationEventListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationEventListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
