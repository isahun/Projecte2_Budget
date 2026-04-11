import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BudgetSearch } from './budget-search';
import { mockBudgetServiceProvider } from '../../testing/mocks';

describe('BudgetSearch', () => {
  let component: BudgetSearch;
  let fixture: ComponentFixture<BudgetSearch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BudgetSearch, FormsModule],
      providers: [mockBudgetServiceProvider]
    }).compileComponents();

    fixture = TestBed.createComponent(BudgetSearch);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
