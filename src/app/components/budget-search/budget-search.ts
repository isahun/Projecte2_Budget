import { Component, inject } from '@angular/core';
import { BudgetService } from '../../services/budget-service';

@Component({
  selector: 'app-budget-search',
  imports: [],
  templateUrl: './budget-search.html',
  styleUrl: './budget-search.css',
})
export class BudgetSearch {
  public budgetService = inject(BudgetService);

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.budgetService.searchTerm.set(value);
  }

  changeSort(criteria: 'date' | 'name' | 'amount') {
    if (this.budgetService.sortBy() === criteria) {
      const newOrder = this.budgetService.sortOrder() === 'asc' ? 'desc' : 'asc';
      this.budgetService.sortOrder.set(newOrder);
    } else {
      this.budgetService.sortBy.set(criteria);
      this.budgetService.sortOrder.set('desc');
    }
  }
}
