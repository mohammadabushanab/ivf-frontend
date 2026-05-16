import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SemenAnalysis } from './semen-analysis';

describe('SemenAnalysis', () => {
  let component: SemenAnalysis;
  let fixture: ComponentFixture<SemenAnalysis>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SemenAnalysis],
    }).compileComponents();

    fixture = TestBed.createComponent(SemenAnalysis);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
