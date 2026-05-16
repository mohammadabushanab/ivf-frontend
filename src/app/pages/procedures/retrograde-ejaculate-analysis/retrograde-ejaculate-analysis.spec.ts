import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetrogradeEjaculateAnalysis } from './retrograde-ejaculate-analysis';

describe('RetrogradeEjaculateAnalysis', () => {
  let component: RetrogradeEjaculateAnalysis;
  let fixture: ComponentFixture<RetrogradeEjaculateAnalysis>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RetrogradeEjaculateAnalysis],
    }).compileComponents();

    fixture = TestBed.createComponent(RetrogradeEjaculateAnalysis);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
