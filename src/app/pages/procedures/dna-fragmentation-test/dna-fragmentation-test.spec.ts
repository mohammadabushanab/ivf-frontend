import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DNAFragmentationTest } from './dna-fragmentation-test';

describe('DNAFragmentationTest', () => {
  let component: DNAFragmentationTest;
  let fixture: ComponentFixture<DNAFragmentationTest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DNAFragmentationTest],
    }).compileComponents();

    fixture = TestBed.createComponent(DNAFragmentationTest);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
