import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BudgetCalculator } from './budget-calculator';
import { mockBudgetServiceProvider } from '../../testing/mocks';

describe('BudgetCalculator', () => {
  let component: BudgetCalculator;
  let fixture: ComponentFixture<BudgetCalculator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BudgetCalculator],
      providers: [mockBudgetServiceProvider]
    }).compileComponents();

    fixture = TestBed.createComponent(BudgetCalculator);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
