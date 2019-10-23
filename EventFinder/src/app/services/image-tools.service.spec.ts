import { TestBed } from '@angular/core/testing';

import { ImageToolsService } from './image-tools.service';

describe('ImageToolsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ImageToolsService = TestBed.get(ImageToolsService);
    expect(service).toBeTruthy();
  });
});
