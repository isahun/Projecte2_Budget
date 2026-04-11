// ============================================================
// WEB CUSTOMIZER — control d'increment/decrement de pàgines i idiomes
//
// Il·lustra un principi important: no TOT l'estat ha d'anar al servei.
//   - numPages i numLanguages → al servei (BudgetService les necessita per calcular totalPrice)
//   - isModalOpen i modalText  → locals (cap altre component les necessita)
// ============================================================

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
  // public: el template usa budgetService.numPages() i budgetService.numLanguages()
  // directament a la vista (interpolació i binding).
  public budgetService = inject(BudgetService);

  // Estat LOCAL d'aquest component: controlen si el modal d'info és visible
  // i quin text mostra. No té sentit guardar-ho al servei global perquè:
  //   a) cap altre component necessita saber si el modal està obert
  //   b) el servei quedaria contaminat amb detalls visuals d'un sol component
  isModalOpen = signal(false);
  modalText = signal('');

  // 'value' serà +1 (botó +) o -1 (botó -), passat des del template.
  // Disseny: un sol mètode per als dos botons en lloc de "incrementPages" i "decrementPages".
  updatePages(value: number) {
    const current = this.budgetService.numPages();
    // Guardem el valor actual ABANS de canviar-lo per poder validar.
    // Si estem intentant restar (value === -1) i ja som al mínim (1), sortim.
    // 'return' sense valor en una funció void simplement atura l'execució.
    if (value === -1 && current <= 1) return;
    // .set() substitueix el valor del signal. current + value pot ser
    // current + 1 (incrementar) o current - 1 (decrementar).
    this.budgetService.numPages.set(current + value);
  }

  updateLanguages(value: number) {
    const current = this.budgetService.numLanguages();
    if (value === -1 && current <= 1) return;
    this.budgetService.numLanguages.set(current + value);
  }

  // 'type' és un tipus "union literal": accepta exactament 'pages' o 'languages'.
  // Això és millor que 'string' perquè TypeScript comprova en temps de compilació
  // que no es pugui passar cap altra cadena. Evita errors silenciosos.
  openInfo(type: 'pages' | 'languages') {
    // Recuperem els textos de l'arxiu de constants extern (info-text.ts).
    // Centralitzar les cadenes de text evita repetir-les i facilita traduccions.
    this.modalText.set(type === 'pages' ? INFO_MESSAGES.pages : INFO_MESSAGES.languages);
    this.isModalOpen.set(true);
  }
}
