import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetHistory } from './budget-history';

describe('BudgetHistory', () => {
  let component: BudgetHistory;
  let fixture: ComponentFixture<BudgetHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BudgetHistory],
    }).compileComponents();

    fixture = TestBed.createComponent(BudgetHistory);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
