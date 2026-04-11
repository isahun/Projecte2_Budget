import { signal } from '@angular/core';
import { BudgetService } from '../services/budget-service';

export const mockBudgetServiceProvider = {
  provide: BudgetService,
  useValue: {
    // --- Signals de Dades ---
    services: signal([]),
    numPages: signal(1),
    numLanguages: signal(1),
    budgetHistory: signal([]),

    // --- Signals d'Estat de la UI ---
    isLoading: signal(false),
    error: signal(null),

    // --- Signals de Filtres (Molt importants per al Search!) ---
    searchTerm: signal(''),
    sortBy: signal('date'),
    sortOrder: signal('desc'),

    // --- Computed (als Mocks els tractem com a Signals normals) ---
    totalPrice: signal(0),
    filteredBudgets: signal([]),

    // --- Mètodes (fem que no facin res per evitar errors) ---
    fetchBudgets: () => Promise.resolve(),
    addBudget: () => Promise.resolve(),
    deleteBudget: () => Promise.resolve(),
    updateServiceSelection: () => {},
    resetFilters: () => {}
  }
};
