import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SemenPreparationForIui } from './semen-preparation-for-iui';

describe('SemenPreparationForIui', () => {
  let component: SemenPreparationForIui;
  let fixture: ComponentFixture<SemenPreparationForIui>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SemenPreparationForIui],
    }).compileComponents();

    fixture = TestBed.createComponent(SemenPreparationForIui);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
