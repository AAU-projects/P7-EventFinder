import { TestBed } from '@angular/core/testing';

import { OrganizationService } from './organizer.service';

describe('OrganizerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OrganizationService = TestBed.get(OrganizationService);
    expect(service).toBeTruthy();
  });
});
