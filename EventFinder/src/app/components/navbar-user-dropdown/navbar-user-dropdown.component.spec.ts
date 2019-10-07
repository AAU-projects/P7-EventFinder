import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarUserDropdownComponent } from './navbar-user-dropdown.component';

describe('NavbarUserDropdownComponent', () => {
  let component: NavbarUserDropdownComponent;
  let fixture: ComponentFixture<NavbarUserDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavbarUserDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarUserDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
