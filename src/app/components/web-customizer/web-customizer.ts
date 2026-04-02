import { Component, inject, signal } from '@angular/core';
import { BudgetService } from '../../services/budget-service';
import { InfoModal } from '../info-modal/info-modal';
import { INFO_MESSAGES } from '../../core/data/info-text';

@Component({
  selector: 'app-web-customizer',
  imports: [InfoModal],
  templateUrl: './web-customizer.html',
  styleUrl: './web-customizer.css',
})
export class WebCustomizer {
  public budgetService = inject(BudgetService);

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
    //Validem again
    if (value === -1 && current <= 1) return;
    this.budgetService.numLanguages.set(current + value);
  }

  openInfo(type: 'pages' | 'languages') {
    const pagesMsg = INFO_MESSAGES.pages;
    const langMsg = INFO_MESSAGES.languages;

    if (type === 'pages') {
      this.modalText.set(pagesMsg);
    } else {
      this.modalText.set(langMsg);
    }
    this.isModalOpen.set(true);
  }
}
