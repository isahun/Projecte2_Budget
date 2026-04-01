import { Injectable, signal, computed } from '@angular/core';
import { Service, Budget } from '../interfaces/budget-service.interface';
import { services } from '../core/data/services-obj';

@Injectable({
  providedIn: 'root',
})
export class BudgetService {
  // 1. La llista de serveis disponibles (les nostres "cards")
  // Fem servir un Signal per saber quan l'usuari els marca/desmarca
  services = signal<Service[]>(services);

  // 2. Les variables de la web (pàgines i idiomes)
  numPages = signal(1); //1 --> valor q apareix x defecte
  numLanguages = signal(1);

  // 3. EL CÀLCUL (La part intel·ligent)
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

  // 4. L'històric de pressupostos (la nostra base de dades local)
  budgetHistory = signal<Budget[]>([]); //<Budget[]> defineix tipus, i ([]) estableix com a valor inicial del signal un array buit

  updateServiceSelection(id: string) {
    this.services.update((prevServices) =>
      prevServices.map((service) =>
        service.id === id ? { ...service, isSelected: !service.isSelected } : service,
      ),
    );
  }

  addBudget(newBudget: Budget) {
    //afegim nou pressssu a la llista (Signal) i fem servir operador spread x crear llista nova amb el nou element
    this.budgetHistory.update((currentHistory) => [newBudget, ...currentHistory]);
  }

  searchTerm = signal<string>('');
  sortBy = signal<'date' | 'name' | 'amount'>('date');
  sortOrder = signal<'asc' | 'desc'>('desc');

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

  resetFilters() {
    this.searchTerm.set('');
    this.sortBy.set('date');
    this.sortOrder.set('desc');
  }

  constructor() {} //ho deixem per si hem d'injectar altres eines com la de fer trucades a API externa
}
