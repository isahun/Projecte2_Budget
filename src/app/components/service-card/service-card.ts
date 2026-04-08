import { Component, input, inject } from '@angular/core';
import { Service } from '../../interfaces/service.interface';
import { BudgetService } from '../../services/budget-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-service-card',
  imports: [CommonModule],// CommonModule inclou directives bàsiques com NgIf, NgFor (per si cal al template)
  templateUrl: './service-card.html',
  styleUrl: './service-card.css',
})
export class ServiceCard {
  // Rep l'objecte Service del component pare (BudgetCalculator).
  // required perquè una targeta sense servei no té sentit.
  service = input.required<Service>();

  // private perquè el servei només s'usa internament en aquest component, el template no hi accedeix directament (a diferència d'altres components)
  private budgetService = inject(BudgetService);
  
  toggleService() {
    // Deleguem la lògica al servei passant-li l'id del servei actual.
    // El servei s'encarrega d'invertir isSelected i actualitzar el signal global.
    this.budgetService.updateServiceSelection(this.service().id);
    }
}
