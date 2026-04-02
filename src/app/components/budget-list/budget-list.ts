import { Component, Input, inject } from '@angular/core';
import { BudgetCard } from '../budget-card/budget-card';
import { Budget } from '../../interfaces/budget-service.interface';
import { BudgetService } from '../../services/budget-service';

@Component({
  selector: 'app-budget-list',
  imports: [BudgetCard],
  templateUrl: './budget-list.html',
  styleUrl: './budget-list.css',
})
export class BudgetList {

  @Input({ required: true }) budgets: Budget[] = [];
  public budgetService = inject(BudgetService);

  onDeleteBudget(id: number) {
    if (confirm('Segur que vols esborrar aquest pressupost?')){
      this.budgetService.deleteBudget(id);
    }
  }
}
