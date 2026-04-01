import { Component, inject } from '@angular/core';
import { BudgetList } from '../budget-list/budget-list';
import { BudgetService } from '../../services/budget-service';
import { BudgetSearch } from '../budget-search/budget-search';


@Component({
  selector: 'app-budget-history',
  imports: [BudgetList, BudgetSearch],
  templateUrl: './budget-history.html',
  styleUrl: './budget-history.css',
})
export class BudgetHistory {
  public budgetService = inject(BudgetService);
}
