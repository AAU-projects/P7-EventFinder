import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackTileComponent } from './feedback-tile.component';

describe('FeedbackTileComponent', () => {
  let component: FeedbackTileComponent;
  let fixture: ComponentFixture<FeedbackTileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedbackTileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
