import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicOrganizationComponent } from './public-organization.component';

describe('PublicOrganizationComponent', () => {
  let component: PublicOrganizationComponent;
  let fixture: ComponentFixture<PublicOrganizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicOrganizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicOrganizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
