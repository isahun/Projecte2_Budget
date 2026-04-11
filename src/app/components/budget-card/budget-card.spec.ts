import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BudgetCard } from './budget-card';
import { Budget } from '../../interfaces/budget.interface';
import { mockBudgetServiceProvider } from '../../testing/mocks';

describe('BudgetCard', () => {
  let component: BudgetCard;
  let fixture: ComponentFixture<BudgetCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BudgetCard],
      providers: [mockBudgetServiceProvider],
    }).compileComponents();

    fixture = TestBed.createComponent(BudgetCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('budget', {
      id: 1,
      clientName: 'Test Client',
      clientEmail: 'test@example.com',
      clientPhone: '123456789',
      services: [],
      total: 500,
      date: new Date(),
    } as Budget);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
