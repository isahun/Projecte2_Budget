import { Component, Input, inject } from '@angular/core';
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
  // El "pare" ens passarà la informació del servei
  @Input({ required: true }) service!: Service;

  //Injectem el recepcionista, el servei
  private budgetService = inject(BudgetService);

  //Mètode per avisar que hem clicat el checkbox
  toggleService() {
    this.budgetService.updateServiceSelection(this.service.id);
    }
}
