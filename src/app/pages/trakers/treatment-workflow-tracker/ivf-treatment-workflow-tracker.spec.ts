import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IVFTreatmentWorkflowTracker } from './ivf-treatment-workflow-tracker';

describe('TreatmentWorkflowTracker', () => {
  let component: IVFTreatmentWorkflowTracker;
  let fixture: ComponentFixture<IVFTreatmentWorkflowTracker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IVFTreatmentWorkflowTracker],
    }).compileComponents();

    fixture = TestBed.createComponent(IVFTreatmentWorkflowTracker);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
