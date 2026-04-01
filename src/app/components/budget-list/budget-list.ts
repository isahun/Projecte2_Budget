import { Component, Input } from '@angular/core';
import { BudgetCard } from '../budget-card/budget-card';
import { Budget } from '../../interfaces/budget-service.interface';

@Component({
  selector: 'app-budget-list',
  imports: [BudgetCard],
  templateUrl: './budget-list.html',
  styleUrl: './budget-list.css',
})
export class BudgetList {

  @Input({ required: true }) budgets: Budget[] = [];
}
