import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetSearch } from './budget-search';

describe('BudgetSearch', () => {
  let component: BudgetSearch;
  let fixture: ComponentFixture<BudgetSearch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BudgetSearch],
    }).compileComponents();

    fixture = TestBed.createComponent(BudgetSearch);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
