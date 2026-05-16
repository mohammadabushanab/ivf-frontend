import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TesticularSpermRetrieval } from './testicular-sperm-retrieval';

describe('TesticularSpermRetrieval', () => {
  let component: TesticularSpermRetrieval;
  let fixture: ComponentFixture<TesticularSpermRetrieval>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TesticularSpermRetrieval],
    }).compileComponents();

    fixture = TestBed.createComponent(TesticularSpermRetrieval);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
