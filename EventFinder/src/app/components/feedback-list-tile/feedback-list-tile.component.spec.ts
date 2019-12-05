import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackListTileComponent } from './feedback-list-tile.component';

describe('FeedbackListTileComponent', () => {
  let component: FeedbackListTileComponent;
  let fixture: ComponentFixture<FeedbackListTileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedbackListTileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackListTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
