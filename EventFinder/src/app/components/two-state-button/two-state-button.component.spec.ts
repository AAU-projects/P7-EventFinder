import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TwoStateButtonComponent } from './two-state-button.component';

describe('TwoStateButtonComponent', () => {
  let component: TwoStateButtonComponent;
  let fixture: ComponentFixture<TwoStateButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TwoStateButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TwoStateButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
