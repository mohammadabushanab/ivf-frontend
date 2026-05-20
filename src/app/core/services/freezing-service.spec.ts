import { TestBed } from '@angular/core/testing';

import { FreezingService } from './freezing-service';

describe('DashboardService', () => {
  let service: FreezingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FreezingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
