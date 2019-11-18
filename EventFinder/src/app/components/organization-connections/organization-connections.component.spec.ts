import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationConnectionsComponent } from './organization-connections.component';

describe('OrganizationConnectionsComponent', () => {
  let component: OrganizationConnectionsComponent;
  let fixture: ComponentFixture<OrganizationConnectionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganizationConnectionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationConnectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
