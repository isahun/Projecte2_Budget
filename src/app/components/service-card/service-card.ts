import { Component, input, inject } from '@angular/core';
import { Service } from '../../interfaces/budget-service.interface';
import { BudgetService } from '../../services/budget-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-service-card',
  imports: [CommonModule],
  templateUrl: './service-card.html',
  styleUrl: './service-card.css',
})
export class ServiceCard {
  service = input.required<Service>();
  private budgetService = inject(BudgetService);

  toggleService() {
    this.budgetService.updateServiceSelection(this.service().id);
    }
}
