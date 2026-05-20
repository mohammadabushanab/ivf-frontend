import { TestBed } from '@angular/core/testing';

import { TreatmentService } from './treatment-service';

describe('ReatmentService', () => {
  let service: TreatmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TreatmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
