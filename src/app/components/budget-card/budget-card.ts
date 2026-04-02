import { Component, Input } from '@angular/core';
import { Budget } from '../../interfaces/budget-service.interface';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-budget-card',
  imports: [DatePipe],
  templateUrl: './budget-card.html',
  styleUrl: './budget-card.css',
})
export class BudgetCard {
  @Input({ required: true }) budget!: Budget;
}
