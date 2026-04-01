import { Injectable, signal, computed } from '@angular/core';
import { Service, Budget } from '../interfaces/budget-service.interface';
import { services } from '../core/data/services-obj';
import { supabase } from '../config/supabase.config';

@Injectable({
  providedIn: 'root',
})
export class BudgetService {
  // --- 1. ESTAT DE DADES ---

  // 1. La llista de serveis disponibles (les nostres "cards")
  // Fem servir un Signal per saber quan l'usuari els marca/desmarca
  services = signal<Service[]>(services);
  // 2. Les variables de la web (pàgines i idiomes)
  numPages = signal(1); //1 --> valor q apareix x defecte
  numLanguages = signal(1);
  // 3. L'històric de pressupostos (la nostra base de dades local)
  budgetHistory = signal<Budget[]>([]); //<Budget[]> defineix tipus, i ([]) estableix com a valor inicial del signal un array buit

  // --- 2. ESTAT DE LA UI (Filtres/Ordre) ---
  searchTerm = signal<string>('');
  sortBy = signal<'date' | 'name' | 'amount'>('date');
  sortOrder = signal<'asc' | 'desc'>('desc');

  // --- 3. CÀLCULS DERIVATS (Computed) ---
  // El "computed" és un Signal que es calcula sol quan canvien els altres. Angular està vigilant: si l'usuari marca un checkbox o canvia el número de pàgines, el totalPrice es recalcula sol i l'envia a la pantalla.
  totalPrice = computed(() => {
    //Sumem el preu dels serveis seleccionats
    let total = this.services()
      .filter((service) => service.isSelected)
      .reduce((acc, service) => acc + service.price, 0);

    // Si la web està seleccionada, afegim el cost extra
    const isWebSelected = this.services().find((service) => service.id === 'web')?.isSelected;
    if (isWebSelected) {
      total += (this.numPages() + this.numLanguages()) * 30;
    }

    return total;
  });

  filteredBudgets = computed(() => {
    let history = [...this.budgetHistory()]; //copia x no espatllar original
    const term = this.searchTerm().toLowerCase();

    // Primer: Filtrem pel nom
    if (term) {
      history = history.filter((b) => b.clientName.toLowerCase().includes(term));
    }

    // Segon: Ordenem segons el que l'usuari hagi triat
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
        // Si l'ordre és 'desc', multipliquem per -1 per capgirar el resultat
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
  // ACCIÓ: Llegir de Supabase
  async fetchBudgets() {
    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) {
      // Mapegem el que ve de la DB (snake_case) al nostre format (camelCase)
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

  // ACCIÓ: Guardar a Supabase
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
