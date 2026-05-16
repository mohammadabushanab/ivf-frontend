import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OocytePickUp } from './oocyte-pick-up';

describe('OocytePickUp', () => {
  let component: OocytePickUp;
  let fixture: ComponentFixture<OocytePickUp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OocytePickUp],
    }).compileComponents();

    fixture = TestBed.createComponent(OocytePickUp);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
