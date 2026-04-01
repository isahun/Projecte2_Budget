import { Component, Input } from '@angular/core';
import { Budget } from '../../interfaces/budget-service.interface';

@Component({
  selector: 'app-budget-card',
  imports: [],
  templateUrl: './budget-card.html',
  styleUrl: './budget-card.css',
})
export class BudgetCard {
  @Input({ required: true }) budget!: Budget;
}
