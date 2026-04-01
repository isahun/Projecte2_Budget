import { Component, inject } from '@angular/core';
import { BudgetService } from '../../services/budget-service';

@Component({
  selector: 'app-web-customizer',
  imports: [],
  templateUrl: './web-customizer.html',
  styleUrl: './web-customizer.css',
})
export class WebCustomizer {
  public budgetService = inject(BudgetService);

  updatePages(value: number) {
    const current = this.budgetService.numPages();
    //Validem, si intentem restar i ja som a 1, no fem res
    if (value === -1 && current <= 1) return;
    this.budgetService.numPages.set(current + value);
  }

  updateLanguages(value: number) {
    const current = this.budgetService.numLanguages();
    //Validem again
    if (value === -1 && current <= 1) return;
    this.budgetService.numLanguages.set(current + value);
  }
}
