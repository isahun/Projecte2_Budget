import { supabase } from './../config/supabase.config';
import { Injectable, signal, computed, inject } from '@angular/core';
import { Service, Budget } from '../interfaces/budget-service.interface';
import { services } from '../core/data/services-obj';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root',
})
export class BudgetService {
  private supabase = inject(SupabaseClient);

  // --- 1. ESTAT DE DADES REACTIVES---
  services = signal<Service[]>(services);
  numPages = signal(1); //1 --> valor q apareix x defecte
  numLanguages = signal(1);
  budgetHistory = signal<Budget[]>([]); //<Budget[]> defineix tipus, i ([]) estableix com a valor inicial del signal un array buit

  // --- 2. ESTAT DE LA UI (Filtres/Ordre) ---
  searchTerm = signal<string>('');
  sortBy = signal<'date' | 'name' | 'amount'>('date');
  sortOrder = signal<'asc' | 'desc'>('desc');

  // --- 3. CÀLCULS DERIVATS (Computed) ---
  totalPrice = computed(() => {
    let total = this.services()
      .filter((service) => service.isSelected)
      .reduce((acc, service) => acc + service.price, 0);

    const isWebSelected = this.services().find((service) => service.id === 'web')?.isSelected;
    if (isWebSelected) {
      total += (this.numPages() + this.numLanguages()) * 30;
    }

    return total;
  });

  filteredBudgets = computed(() => {
    let history = [...this.budgetHistory()];
    const term = this.searchTerm().toLowerCase();

    if (term) {
      history = history.filter((b) => b.clientName.toLowerCase().includes(term));
    }

    history.sort((a, b) => {
      if (this.sortBy() === 'date') {
        return this.sortOrder() === 'desc'
          ? b.date.getTime() - a.date.getTime()
          : a.date.getTime() - b.date.getTime();
      }

      if (this.sortBy() === 'amount') {
        return this.sortOrder() === 'desc' ? b.total - a.total : a.total - b.total;
      }

      if (this.sortBy() === 'name') {
        const comparison = a.clientName.localeCompare(b.clientName);
        return this.sortOrder() === 'asc' ? comparison : comparison * -1;
      }

      return 0;
    });

    if (!term) return history;

    return history.filter((b) => b.clientName.toLowerCase().includes(term));
  });

  // --- 4. CONSTRUCTOR ---
  constructor() {
    this.fetchBudgets();
  }

  // --- 5. MÈTODES D'ACCIÓ ---
  async fetchBudgets() {
    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) {
      const mappedBudgets: Budget[] = data.map((b: any) => ({
        id: b.id,
        clientName: b.client_name,
        clientEmail: b.client_email,
        clientPhone: b.client_phone,
        total: b.total,
        services: b.services,
        date: new Date(b.created_at),
      }));
      this.budgetHistory.set(mappedBudgets);
    }
  }

  async addBudget(newBudget: Budget) {
    const { error } = await supabase.from('budgets').insert([
      {
        client_name: newBudget.clientName,
        client_email: newBudget.clientEmail,
        client_phone: newBudget.clientPhone,
        total: newBudget.total,
        services: newBudget.services,
      },
    ]);

    if (!error) {
      await this.fetchBudgets(); // Refresquem la llista
    }
  }

  async deleteBudget(id: number) {
    const { error } = await this.supabase
    .from('budgets')
    .delete()
    .eq('id', id);

    if (error) {
      console.error('Error en esborrar:', error);
      return;
    }
    this.budgetHistory.update(budgets => budgets.filter(b => b.id !== id));
    }

  updateServiceSelection(id: string) {
    this.services.update((prevServices) =>
      prevServices.map((s) =>
        s.id === id ? { ...s, isSelected: !s.isSelected } : s,
      ),
    );
  }

  resetFilters() {
    this.searchTerm.set('');
    this.sortBy.set('date');
    this.sortOrder.set('desc');
  }
}
