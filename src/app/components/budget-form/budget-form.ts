// ============================================================
// BUDGET FORM — captura de dades del client i enviament
//
// Responsabilitats:
//   1. Definir i validar el formulari reactiu (nom, telèfon, email)
//   2. Construir l'objecte Budget amb les dades del formulari + estat del servei
//   3. Enviar-lo a BudgetService i gestionar l'èxit/error
// ============================================================

import { Component, inject } from '@angular/core';
import { BudgetService } from '../../services/budget-service';
// ReactiveFormsModule: mòdul d'Angular per a formularis reactius (FormGroup, FormControl, etc.)
// FormBuilder: servei ajudant que crea grups de controls de manera concisa
// Validators: objecte amb funcions de validació predefinides (required, minLength, email...)
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { validators } from '../../core/data/validators';

@Component({
  selector: 'app-budget-form',
  // Cal importar ReactiveFormsModule perquè el template pugui usar
  // [formGroup], formControlName, i les directives de formulari reactiu.
  imports: [ReactiveFormsModule],
  templateUrl: './budget-form.html',
  styleUrl: './budget-form.css',
})
export class BudgetForm {
  // FormBuilder és un servei d'Angular que simplifica la creació de formularis.
  // private: el template no l'usa directament, és un detall d'implementació.
  private fb = inject(FormBuilder);

  // public: el template necessita accedir a budgetService per llegir
  // totalPrice(), isLoading(), error(), etc.
  public budgetService = inject(BudgetService);

  // fb.group(validators) crea un FormGroup a partir de l'objecte de validators
  // definit a core/data/validators.ts. Cada clau de l'objecte és un FormControl.
  // Separar els validators a un fitxer extern evita repetir-los si el formulari
  // es reutilitza en un altre component.
  budgetForm = this.fb.group(validators);

  // async: el mètode fa operacions asíncrones (espera Supabase).
  // Sense async no podríem usar 'await' a dins.
  async submitBudget() {
    // .valid: true si tots els controls passen les seves validacions.
    // Comprovem aquí per seguretat, tot i que el botó d'enviament
    // ja té [disabled]="budgetForm.invalid" al template.
    if (this.budgetForm.valid) {

      // Construïm la llista de serveis seleccionats amb les dades de personalització.
      // .filter() descarta els serveis no seleccionats.
      // .map() transforma cada servei: si és 'web', hi afegim pages i languages.
      const selectedServices = this.budgetService
        .services()
        .filter((s) => s.isSelected)
        .map((s) => {
          if (s.id === 'web') {
            // Spread { ...s, pages: ..., languages: ... }:
            // Crea un nou objecte copiant totes les propietats de 's' i afegint
            // (o sobreescrivint) pages i languages. Preserva immutabilitat.
            return {
              ...s,
              pages: this.budgetService.numPages(),
              languages: this.budgetService.numLanguages(),
            };
          }
          return s; // per a SEO i Ads, retornem el servei sense canvis
        });

      // Construïm l'objecte Budget complet que s'enviarà a Supabase.
      const newBudget = {
        // Date.now() retorna el timestamp actual en ms com a número.
        // Serveix d'ID provisional local (Supabase generarà el seu propi ID real).
        id: Date.now(),

        // this.budgetForm.value.name és de tipus string | null | undefined
        // perquè Angular no pot garantir que l'usuari hagi escrit res.
        // 'as string' és un type assertion: li diem a TypeScript "confio que
        // és string" — és segur aquí perquè ja hem comprovat que .valid és true.
        clientName: this.budgetForm.value.name as string,
        clientEmail: this.budgetForm.value.email as string,
        clientPhone: this.budgetForm.value.phone as string,
        services: selectedServices,
        total: this.budgetService.totalPrice(), // llegim el computed del servei
        date: new Date(), // data i hora actuals
      };

      try {
        // await: pausa aquí fins que addBudget() acabi (èxit o error).
        // Si addBudget() llança un error (throw err), el control salta al catch.
        await this.budgetService.addBudget(newBudget);

        // Aquestes línies NOMÉS s'executen si addBudget() ha anat bé.
        // .reset() buida tots els camps i reseteja l'estat de validació.
        this.budgetForm.reset();
        // Resetegem el customizer de web als valors per defecte.
        this.budgetService.numPages.set(1);
        this.budgetService.numLanguages.set(1);

      } catch (error) {
        // Entrem aquí si addBudget() ha llançat un error (Supabase, xarxa...).
        // console.error mostra el detall tècnic a la consola del navegador (F12).
        console.error('Error en l enviament', error);
        // alert() és un diàleg bloquejant natiu del navegador — senzill per a un MVP.
        alert('Vaja! No s ha pogut guardar el pressupost');
      }

    } else {
      // Si el formulari és invàlid i l'usuari clica "Enviar" (per exemple,
      // amb JavaScript desactivat o manipulant el DOM), forcem la visualització
      // de tots els missatges d'error.
      console.warn('Formulari invàlid. Revisa els camps.');
      // .markAllAsTouched(): normalment els errors només es mostren quan
      // l'usuari ha "tocat" (fet focus i blur) un camp. Amb aquest mètode
      // marquem tots els controls com a "tocats" d'un cop, revelant tots els errors.
      this.budgetForm.markAllAsTouched();
    }
  }
}
