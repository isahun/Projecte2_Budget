import { Component, inject } from '@angular/core';
import { BudgetService } from '../../services/budget-service';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { validators } from '../../core/data/validators';

@Component({
  selector: 'app-budget-form',
  imports: [ReactiveFormsModule],
  templateUrl: './budget-form.html',
  styleUrl: './budget-form.css',
})
export class BudgetForm {
  private fb = inject(FormBuilder);
  public budgetService = inject(BudgetService);

  //Definim formulari amb validacions
  budgetForm = this.fb.group(validators);

  submitBudget() {
    if (this.budgetForm.valid) {
      //si form vàlid, creem objecte pressupost
      const newBudget = {
        id: Date.now(),
        clientName: this.budgetForm.value.name as string,
        clientEmail: this.budgetForm.value.email as string,
        clientPhone: this.budgetForm.value.phone as string,
        //filtrem només serveis seleccionats en el moment
        services: this.budgetService.services().filter(s => s.isSelected),
        total: this.budgetService.totalPrice(),
        date: new Date()
      };

      //enviem a recepció
      this.budgetService.addBudget(newBudget);
      //netegem form dp d'enviar
      this.budgetForm.reset();
    }
  }


}
