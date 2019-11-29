import { TestBed } from '@angular/core/testing';

import { RecommenderService } from './recommender.service';

describe('RecommenderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RecommenderService = TestBed.get(RecommenderService);
    expect(service).toBeTruthy();
  });
});
