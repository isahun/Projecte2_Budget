import { supabase } from './../config/supabase.config';
import { Injectable, signal, computed, inject } from '@angular/core';
import { Service } from '../interfaces/service.interface';
import { Budget } from '../interfaces/budget.interface';
import { services } from '../core/data/services-obj';
import { BudgetApiService } from './budget-api.service';
import { BudgetMapper } from '../core/mappers/budget.mapper';

@Injectable({
  providedIn: 'root',
})
export class BudgetService {
  private api = inject(BudgetApiService);

  services = signal<Service[]>(services);
  numPages = signal(1);
  numLanguages = signal(1);
  budgetHistory = signal<Budget[]>([]);

  isLoading = signal(false);
  error = signal<string | null>(null);

  searchTerm = signal<string>('');
  sortBy = signal<'date' | 'name' | 'amount'>('date');
  sortOrder = signal<'asc' | 'desc'>('desc');

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

    return history.sort((a, b) => {
      const order = this.sortOrder() === 'desc' ? -1 : 1;

      if (this.sortBy() === 'date') {
        return (a.date.getTime() - b.date.getTime()) * order;
      }
      if (this.sortBy() === 'amount') {
        return (a.total - b.total) * order;
      }
      return a.clientName.localeCompare(b.clientName) * order;
    });
  });

  constructor() {
    this.fetchBudgets();
  }

  async fetchBudgets() {
    this.isLoading.set(true);
    this.error.set(null);

    try {
      const { data, error } = await this.api.getBudgets();
      if (error) throw error;

      const mapped = (data || []).map(BudgetMapper.fromRemote);
      this.budgetHistory.set(mapped);
    } catch (err: any) {
      this.error.set(`Error carregant historial: ${err.message}`);
    } finally {
      this.isLoading.set(false);
    }
  }

  async addBudget(newBudget: Budget) {
    this.isLoading.set(true);
    try {
      const remoteData = BudgetMapper.toRemote(newBudget);
      const { error } = await this.api.saveBudget(remoteData);
      if (error) throw error;
      await this.fetchBudgets();
    } catch (err: any) {
      this.error.set(`Error en guardar: ${err.message}`);
    } finally {
      this.isLoading.set(false);
    }
  }

  async deleteBudget(id: number) {
    this.isLoading.set(true);

    try {
      const { error } = await this.api.deleteBudget(id);
      if (error) throw error;

      this.budgetHistory.update((budgets) => budgets.filter((b) => b.id !== id));
    } catch (err: any) {
      this.error.set(`Error en esborrar: ${err.message}`);
    } finally {
      this.isLoading.set(false);
    }
  }

  updateServiceSelection(id: string) {
    this.services.update((prevServices) =>
      prevServices.map((s) => (s.id === id ? { ...s, isSelected: !s.isSelected } : s)),
    );
  }

  resetFilters() {
    this.searchTerm.set('');
    this.sortBy.set('date');
    this.sortOrder.set('desc');
  }
}
