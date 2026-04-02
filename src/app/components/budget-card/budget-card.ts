import { Component, input, output } from '@angular/core';
import { Budget } from '../../interfaces/budget-service.interface';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-budget-card',
  imports: [DatePipe],
  templateUrl: './budget-card.html',
  styleUrl: './budget-card.css',
})
export class BudgetCard {
  budget = input.required<Budget>();
  deleteRequest = output<number>();

  onDelete() {
    console.log('1. Clic rebut a la card per ID:', this.budget().id);
    this.deleteRequest.emit(this.budget().id)
  }
}
