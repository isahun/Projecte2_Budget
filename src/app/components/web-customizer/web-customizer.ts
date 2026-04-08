import { Component, inject, signal } from '@angular/core';
import { BudgetService } from '../../services/budget-service';
import { InfoModal } from '../info-modal/info-modal';
import { INFO_MESSAGES } from '../../core/data/info-text'; // Objecte amb els textos informatius dels modals

@Component({
  selector: 'app-web-customizer',
  imports: [InfoModal], // Necessitem InfoModal perquè el fem servir al template
  templateUrl: './web-customizer.html',
  styleUrl: './web-customizer.css',
})
export class WebCustomizer {
  public budgetService = inject(BudgetService); // public perquè el template accedeix a numPages() i numLanguages()

  // Estat local del modal — no cal que visqui al servei perquè
  // només afecta aquest component, cap altre el necessita
  isModalOpen = signal(false);
  modalText = signal('');

  updatePages(value: number) {
    const current = this.budgetService.numPages();
    //Validem, si intentem restar i ja som a 1, no fem res
    if (value === -1 && current <= 1) return;
    this.budgetService.numPages.set(current + value);
  }

  updateLanguages(value: number) {
    const current = this.budgetService.numLanguages();

    if (value === -1 && current <= 1) return;
    this.budgetService.numLanguages.set(current + value);
  }

  openInfo(type: 'pages' | 'languages') {
    // Recuperem el text corresponent de l'objecte de constants extern
    // Així els textos estan centralitzats i no hardcodejats aquí
    const pagesMsg = INFO_MESSAGES.pages;
    const langMsg = INFO_MESSAGES.languages;

     // Assignem el text correcte segons el tipus i obrim el modal
    if (type === 'pages') {
      this.modalText.set(pagesMsg);
    } else {
      this.modalText.set(langMsg);
    }
    this.isModalOpen.set(true);
  }
}
