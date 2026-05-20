import { TestBed } from '@angular/core/testing';
import { OPUService } from './opu-service';

describe('ReatmentService', () => {
  let service: OPUService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OPUService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
