import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrozenEmbryoTransfer } from './frozen-embryo-transfer';

describe('FrozenEmbryoTransfer', () => {
  let component: FrozenEmbryoTransfer;
  let fixture: ComponentFixture<FrozenEmbryoTransfer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FrozenEmbryoTransfer],
    }).compileComponents();

    fixture = TestBed.createComponent(FrozenEmbryoTransfer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
