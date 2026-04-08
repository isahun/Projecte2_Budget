// Importem Component per definir el component, i inject per obtenir serveis sense constructor
import { Component, inject } from '@angular/core';

// Importem els components fills que aquest component utilitza al seu template
import { ServiceCard } from "../service-card/service-card";
import { WebCustomizer } from '../web-customizer/web-customizer';

// Importem el servei que conté tota la lògica i l'estat de la calculadora
import { BudgetService } from '../../services/budget-service';


@Component({
  selector: 'app-budget-calculator', // Etiqueta HTML per usar aquest component: <app-budget-calculator>
  imports: [ServiceCard, WebCustomizer], // Components fills que fem servir al template — cal declarar-los aquí
  templateUrl: './budget-calculator.html',
  styleUrl: './budget-calculator.css',
})
export class BudgetCalculator {
  public budgetService = inject(BudgetService);
  // inject() és la manera moderna d'Angular d'obtenir una instància del servei. És equivalent a posar-ho al constructor: constructor(public budgetService: BudgetService) {} Ho fem public perquè el template HTML necessita accedir-hi directament
}
