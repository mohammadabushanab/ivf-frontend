import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EggFreezing } from './egg-freezing';

describe('EggFreezing', () => {
  let component: EggFreezing;
  let fixture: ComponentFixture<EggFreezing>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EggFreezing],
    }).compileComponents();

    fixture = TestBed.createComponent(EggFreezing);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
