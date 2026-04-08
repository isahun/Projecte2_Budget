import { Component, inject } from '@angular/core';
import { BudgetService } from '../../services/budget-service';

@Component({
  selector: 'app-budget-search',
  imports: [], // Cap component fill necessari, aquest component només usa elements HTML nadius
  templateUrl: './budget-search.html',
  styleUrl: './budget-search.css',
})
export class BudgetSearch {
  public budgetService = inject(BudgetService);

  onSearch(event: Event) {
    // L'event natiu del navegador no sap que l'element és un input,
    // el cast "as HTMLInputElement" li diu a TypeScript el tipus exacte
    // per poder accedir a .value sense error de compilació
    const value = (event.target as HTMLInputElement).value;
    this.budgetService.searchTerm.set(value); // Actualitzem el signal → filteredBudgets es recalcula sol
  }

  changeSort(criteria: 'date' | 'name' | 'amount') {
    if (this.budgetService.sortBy() === criteria) {
      //Si cliquem el mateix criteri que ja està actiu → invertim l'ordre (toggle asc/desc)
      const newOrder = this.budgetService.sortOrder() === 'asc' ? 'desc' : 'asc';
      this.budgetService.sortOrder.set(newOrder);
    } else {
      // Si cliquem un criteri diferent → canviem el criteri i resetegem a desc per defecte
      this.budgetService.sortBy.set(criteria);
      this.budgetService.sortOrder.set('desc');
    }
  }
}
