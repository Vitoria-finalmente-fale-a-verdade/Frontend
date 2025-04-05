import { TestBed } from '@angular/core/testing';

import { PermanentCropService } from './permanent-crop.service';

describe('CultureService', () => {
  let service: PermanentCropService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PermanentCropService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
