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
    console.log('Botó clicat!'); // Això ha de sortir a la consola (F12)

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

      //si form vàlid, creem objecte pressupost
      const newBudget = {
        id: Date.now(),
        clientName: this.budgetForm.value.name as string,
        clientEmail: this.budgetForm.value.email as string,
        clientPhone: this.budgetForm.value.phone as string,
        //filtrem només serveis seleccionats en el moment
        services: selectedServices,
        total: this.budgetService.totalPrice(),
        date: new Date(),
      };

      console.log('Enviant a Supabase...', newBudget);

      try {
        // 2. Esperem que el servei ens confirmi que s'ha guardat
        await this.budgetService.addBudget(newBudget);

        console.log('✅ Èxit! Pressupost guardat al núvol.');

        // 3. Només si ha anat bé, netegem el formulari
      this.budgetForm.reset();

      this.budgetService.numPages.set(1);
      this.budgetService.numLanguages.set(1);
      } catch (error) {
        // 4. Si el 'try' falla (per exemple, no hi ha internet o error de base de dades)
        console.error('Error en l enviament', error);
        alert('Vaja! No s ha pogut guardar el pressupost');
        }
      } else {
        console.warn('Formulari invàlid. Revisa els camps.');
        this.budgetForm.markAllAsTouched(); // Perquè l'usuari vegi els errors en vermell
      }

    }
  }

