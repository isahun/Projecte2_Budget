import { Component, input, inject } from '@angular/core';
import { BudgetCard } from '../budget-card/budget-card';
import { Budget } from '../../interfaces/budget.interface';
import { BudgetService } from '../../services/budget-service';

@Component({
  selector: 'app-budget-list',
  imports: [BudgetCard],
  templateUrl: './budget-list.html',
})
export class BudgetList {

  budgets = input.required<Budget[]>();
  public budgetService = inject(BudgetService);

  onDeleteBudget(id: number) {
    if (confirm('Segur que vols esborrar aquest pressupost?')){
      this.budgetService.deleteBudget(id);
    }
  }
}
