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
        ...this.budgetForm.value,
        total: this.budgetService.totalPrice(),
        date: new Date()
      };

      console.log('Pressupost llest per guardar:', newBudget);

      this.budgetForm.reset(); //netegem form dp d'enviar
    }
  }


}
