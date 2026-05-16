import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OvarianTissueCryopreservation } from './ovarian-tissue-cryopreservation';

describe('OvarianTissueCryopreservation', () => {
  let component: OvarianTissueCryopreservation;
  let fixture: ComponentFixture<OvarianTissueCryopreservation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OvarianTissueCryopreservation],
    }).compileComponents();

    fixture = TestBed.createComponent(OvarianTissueCryopreservation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
