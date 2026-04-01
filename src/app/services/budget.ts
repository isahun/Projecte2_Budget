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
      .filter (service => service.isSelected)
      .reduce((acc, service) => acc + service.price, 0);

    // Si la web està seleccionada, afegim el cost extra
      const isWebSelected = this.services().find( service => service.id === 'web')?.isSelected;
      if (isWebSelected) {
        total += (this.numPages() + this.numLanguages()) * 30;
      }

      return total;
  });

  // 4. L'històric de pressupostos (la nostra base de dades local)
  budgetHistory = signal<Budget[]>([]); //<Budget[]> defineix tipus, i ([]) estableix com a valor inicial del signal un array buit

  constructor() {} //ho deixem per si hem d'injectar altres eines com la de fer trucades a API externa
}
