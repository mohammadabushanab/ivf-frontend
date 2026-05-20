import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OocyteFreezing } from './oocyte-freezing';

describe('OocyteFreezing', () => {
  let component: OocyteFreezing;
  let fixture: ComponentFixture<OocyteFreezing>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OocyteFreezing],
    }).compileComponents();

    fixture = TestBed.createComponent(OocyteFreezing);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
