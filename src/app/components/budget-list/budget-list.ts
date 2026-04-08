// inject per obtenir el servei, input per rebre dades del component pare
import { Component, input, inject } from '@angular/core';
import { BudgetCard } from '../budget-card/budget-card';
import { Budget } from '../../interfaces/budget.interface';
import { BudgetService } from '../../services/budget-service';

@Component({
  selector: 'app-budget-list',
  imports: [BudgetCard], // Cal declarar BudgetCard aquí perquè el fem servir al template
  templateUrl: './budget-list.html',
  styleUrl: './budget-list.css',
})
export class BudgetList {
  // Rep la llista de pressupostos del component pare (ja filtrada i ordenada).
  // És required perquè sense dades aquest component no té sentit.
  budgets = input.required<Budget[]>();
  public budgetService = inject(BudgetService); // Injectem el servei per poder cridar deleteBudget() quan arribi l'event del fill

  onDeleteBudget(id: number) {
  //Demanem confirmació abans d'esborrar — confirm() és un diàleg natiu del navegador. Si l'usuari clica "Cancel·lar", no fem res.
    if (confirm('Segur que vols esborrar aquest pressupost?')){
      this.budgetService.deleteBudget(id); // Deleguem l'esborrat real al servei
    }
  }
}

/*
BudgetCard → emet id via output → BudgetList rep $event i demana confirmació → BudgetService esborra de Supabase i actualitza el signal
*/
