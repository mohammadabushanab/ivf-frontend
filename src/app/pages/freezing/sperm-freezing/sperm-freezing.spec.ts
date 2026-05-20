import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpermFreezing } from './sperm-freezing';

describe('SpermFreezing', () => {
  let component: SpermFreezing;
  let fixture: ComponentFixture<SpermFreezing>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpermFreezing],
    }).compileComponents();

    fixture = TestBed.createComponent(SpermFreezing);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
