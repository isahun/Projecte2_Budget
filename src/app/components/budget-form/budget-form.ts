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

  async submitBudget() {
    if (this.budgetForm.valid) {
      const selectedServices = this.budgetService
        .services()
        .filter((s) => s.isSelected)
        .map((s) => {
          if (s.id === 'web') {
            return {
              ...s,
              pages: this.budgetService.numPages(),
              languages: this.budgetService.numLanguages(),
            };
          }
          return s;
        });

      const newBudget = {
        id: Date.now(),
        clientName: this.budgetForm.value.name as string,
        clientEmail: this.budgetForm.value.email as string,
        clientPhone: this.budgetForm.value.phone as string,
        services: selectedServices,
        total: this.budgetService.totalPrice(),
        date: new Date(),
      };

      try {
        await this.budgetService.addBudget(newBudget);


      this.budgetForm.reset();

      this.budgetService.numPages.set(1);
      this.budgetService.numLanguages.set(1);
      } catch (error) {
        console.error('Error en l enviament', error);
        alert('Vaja! No s ha pogut guardar el pressupost');
        }
      } else {
        console.warn('Formulari invàlid. Revisa els camps.');
        this.budgetForm.markAllAsTouched();
      }

    }
  }

