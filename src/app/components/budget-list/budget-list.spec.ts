import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BudgetList } from './budget-list';
import { mockBudgetServiceProvider } from '../../testing/mocks';

describe('BudgetList', () => {
  let component: BudgetList;
  let fixture: ComponentFixture<BudgetList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BudgetList],
      providers: [mockBudgetServiceProvider],
    }).compileComponents();

    fixture = TestBed.createComponent(BudgetList);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('budgets', [
      {
        id: 1,
        clientName: 'Test Irene',
        total: 500,
        date: new Date(),
        services: ['Web'],
      },
    ]);

    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
