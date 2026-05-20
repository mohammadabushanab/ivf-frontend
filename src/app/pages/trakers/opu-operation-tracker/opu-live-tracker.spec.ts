import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OPULiveTracker } from './opu-live-tracker';

describe('OPUOperationTracker', () => {
  let component: OPULiveTracker;
  let fixture: ComponentFixture<OPULiveTracker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OPULiveTracker],
    }).compileComponents();

    fixture = TestBed.createComponent(OPULiveTracker);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
