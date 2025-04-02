import { TestBed } from '@angular/core/testing';

import { ExplorationsService } from './explorations.service';

describe('ExplorationsService', () => {
  let service: ExplorationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExplorationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
