import { TestBed } from '@angular/core/testing';

import { CropService } from './crop.service';

describe('CultureService', () => {
  let service: CropService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CropService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
