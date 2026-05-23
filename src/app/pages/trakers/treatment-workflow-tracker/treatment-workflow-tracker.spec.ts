import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreatmentWorkflowTracker } from './treatment-workflow-tracker';

describe('TreatmentWorkflowTracker', () => {
  let component: TreatmentWorkflowTracker;
  let fixture: ComponentFixture<TreatmentWorkflowTracker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TreatmentWorkflowTracker],
    }).compileComponents();

    fixture = TestBed.createComponent(TreatmentWorkflowTracker);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
