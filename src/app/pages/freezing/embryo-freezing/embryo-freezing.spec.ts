import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmbryoFreezing } from './embryo-freezing';

describe('EmbryoFreezing', () => {
  let component: EmbryoFreezing;
  let fixture: ComponentFixture<EmbryoFreezing>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmbryoFreezing],
    }).compileComponents();

    fixture = TestBed.createComponent(EmbryoFreezing);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
