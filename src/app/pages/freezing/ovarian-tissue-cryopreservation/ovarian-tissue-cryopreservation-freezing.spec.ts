import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OvarianTissueCryopreservationFreezing } from './ovarian-tissue-cryopreservation-freezing';

describe('OvarianTissueCryopreservation', () => {
  let component: OvarianTissueCryopreservationFreezing;
  let fixture: ComponentFixture<OvarianTissueCryopreservationFreezing>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OvarianTissueCryopreservationFreezing],
    }).compileComponents();

    fixture = TestBed.createComponent(OvarianTissueCryopreservationFreezing);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
