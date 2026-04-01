import { Component, inject } from '@angular/core';
import { ServiceCard } from "../service-card/service-card";
import { BudgetService } from '../../services/budget-service';

@Component({
  selector: 'app-budget-calculator',
  imports: [ServiceCard],
  templateUrl: './budget-calculator.html',
  styleUrl: './budget-calculator.css',
})
export class BudgetCalculator {
  public budgetService = inject(BudgetService);
}
