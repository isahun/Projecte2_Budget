// ============================================================
// MOCKS DE TEST — substituts per a BudgetService als tests de components
//
// Per què necessitem mocks?
// BudgetService injecta BudgetApiService, que injecta SupabaseClient.
// Als tests unitaris de components NO volem fer crides reals a la BD.
// Fem servir un objecte fals (mock) que té la mateixa "forma" que el
// servei real però sense efectes secundaris.
//
// Patró: { provide: BudgetService, useValue: mockObject }
// Angular veu "necessito BudgetService" → entrega mockObject en lloc del real.
// ============================================================

import { signal } from '@angular/core';
import { BudgetService } from '../services/budget-service';

export const mockBudgetServiceProvider = {
  // 'provide' indica quin token de DI estem substituint.
  provide: BudgetService,
  // 'useValue' indica quin valor retornarà Angular quan algú injecti BudgetService.
  useValue: {
    // Els signals del mock han de tenir els mateixos noms i tipus inicials
    // que el servei real perquè els templates dels components puguin llegir-los.

    // --- Signals de Dades ---
    services: signal([]),       // array buit: cap servei seleccionat per defecte
    numPages: signal(1),
    numLanguages: signal(1),
    budgetHistory: signal([]),

    // --- Signals d'Estat de la UI ---
    isLoading: signal(false),   // no estem carregant res als tests
    error: signal(null),        // sense errors inicials

    // --- Signals de Filtres ---
    // Importants per a BudgetSearch: el template llegeix sortBy() i sortOrder()
    // per aplicar classes CSS actives als botons d'ordenació.
    searchTerm: signal(''),
    sortBy: signal('date'),
    sortOrder: signal('desc'),

    // --- Computed com a Signals normals ---
    // Els computed reals depenen d'altres signals. Als mocks els simulem com a
    // signals simples amb el valor inicial que necessitem per al test.
    totalPrice: signal(0),
    filteredBudgets: signal([]),

    // --- Mètodes buits (no-ops) ---
    // Retornen Promise.resolve() per no trencar els components que fan 'await'.
    // No fan res real: eviten crides accidentals a Supabase durant els tests.
    fetchBudgets: () => Promise.resolve(),
    addBudget: () => Promise.resolve(),
    deleteBudget: () => Promise.resolve(),
    updateServiceSelection: () => {},
    resetFilters: () => {},
  }
};
