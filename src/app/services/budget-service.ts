// ============================================================
// BUDGET SERVICE — el cervell de l'aplicació
// Centralitza tot l'estat i la lògica de negoci en un únic lloc.
// Els components només llegeixen signals i criden mètodes d'aquí.
// ============================================================

import { Injectable, signal, computed, inject } from '@angular/core';
import { Service } from '../interfaces/service.interface';
import { Budget } from '../interfaces/budget.interface';
import { services } from '../core/data/services-obj';
import { BudgetApiService } from './budget-api.service';
import { BudgetMapper } from '../core/mappers/budget.mapper';

// @Injectable marca la classe com a "servei injectable".
// providedIn: 'root' significa que Angular crea UNA SOLA instància
// per a tota l'app (patró Singleton). Tots els components que l'injectin
// obtenen la mateixa instància i, per tant, comparteixen l'estat.
@Injectable({
  providedIn: 'root',
})
export class BudgetService {

  // inject() és la manera moderna (Angular 14+) d'obtenir dependències.
  // És equivalent a: constructor(private api: BudgetApiService) {}
  // Usem BudgetApiService per aïllar les crides HTTP/Supabase del servei
  // de negoci — separació de responsabilitats (Single Responsibility).
  private api = inject(BudgetApiService);


  // ─────────────────────────────────────────────────────────────
  // BLOC 1: SIGNALS DE DADES
  // Un signal és un contenidor reactiu: quan el seu valor canvia,
  // tots els components i computed que el llegeixen es recalculen
  // automàticament. És com una variable "intel·ligent".
  //
  // Sintaxi:  signal<Tipus>(valorInicial)
  // Llegir:   this.services()      ← cal cridar-lo com una funció
  // Escriure: this.services.set(nouValor)
  // ─────────────────────────────────────────────────────────────

  // Llista de serveis disponibles. La inicialitzem amb les dades
  // de l'arxiu local services-obj.ts (no ve de Supabase).
  services = signal<Service[]>(services);

  // Personalització del servei "Web": nombre de pàgines i idiomes.
  // Valor per defecte 1 perquè el mínim facturable és 1 de cada.
  numPages = signal(1);
  numLanguages = signal(1);

  // Historial de pressupostos carregats de Supabase.
  // Array buit [] com a valor inicial per evitar errors de "undefined".
  budgetHistory = signal<Budget[]>([]);


  // ─────────────────────────────────────────────────────────────
  // BLOC 2: SIGNALS D'ESTAT DE LA UI
  // No representen dades de negoci sinó l'estat visual de la pàgina:
  // si està carregant, si hi ha error, quins filtres estan actius.
  // ─────────────────────────────────────────────────────────────

  // isLoading: true mentre s'espera una resposta de Supabase.
  // El template el fa servir per mostrar/amagar un spinner.
  isLoading = signal(false);

  // error: null si tot va bé, o un string descriptiu si falla Supabase.
  // signal<string | null> és un tipus "union": pot ser string O null.
  error = signal<string | null>(null);

  // Filtres de la llista de pressupostos:
  searchTerm = signal<string>('');  // text que escriu l'usuari
  sortBy = signal<'date' | 'name' | 'amount'>('date'); // camp d'ordenació
  sortOrder = signal<'asc' | 'desc'>('desc'); // direcció (desc = més recent primer)


  // ─────────────────────────────────────────────────────────────
  // BLOC 3: COMPUTED — càlculs derivats (valor llegit, mai escrit)
  //
  // computed(() => ...) crea un signal de NOMÉS LECTURA que es
  // recalcula automàticament cada vegada que canvia qualsevol signal
  // que es llegeix dins la seva funció.
  //
  // Regla clau: MAI s'escriu a un computed. Si necessites canviar-lo,
  // canvia els signals dels quals depèn.
  // ─────────────────────────────────────────────────────────────

  // Calcula el preu total en temps real.
  // Es recalcula automàticament quan canvien: services, numPages o numLanguages.
  totalPrice = computed(() => {
    // .filter() retorna un nou array amb els serveis marcats com a seleccionats.
    // .reduce() suma tots els preus: acc és l'acumulador, comença a 0.
    let total = this.services()
      .filter((service) => service.isSelected)
      .reduce((acc, service) => acc + service.price, 0);

    // L'operador ?. (optional chaining) evita errors si 'web' no existeix:
    // services().find(...) podria retornar undefined, i ?.isSelected
    // retorna undefined en lloc de llançar un TypeError.
    const isWebSelected = this.services().find((service) => service.id === 'web')?.isSelected;
    if (isWebSelected) {
      // Fórmula del briefing: cada pàgina i cada idioma sumen 30€ al preu base.
      total += (this.numPages() + this.numLanguages()) * 30;
    }

    return total;
  });

  // Retorna la llista de pressupostos filtrada per cerca i ordenada.
  // Es recalcula quan canvien: budgetHistory, searchTerm, sortBy o sortOrder.
  filteredBudgets = computed(() => {
    // Spread [...array] crea una còpia superficial de l'array.
    // IMPORTANT: mai mutem el signal directament — sempre treballem amb còpies.
    // Si mutéssim budgetHistory() directament, Angular no detectaria el canvi.
    let history = [...this.budgetHistory()];
    const term = this.searchTerm().toLowerCase();

    // Filtre per nom: si l'usuari ha escrit alguna cosa, descartam els que no coincideixen.
    // .includes() retorna true si la paraula apareix en qualsevol posició del nom.
    if (term) {
      history = history.filter((b) => b.clientName.toLowerCase().includes(term));
    }

    // .sort() ordena l'array in-place (modifica la còpia que hem fet).
    // Rep un comparador: ha de retornar < 0, 0 o > 0.
    //   - negatiu → 'a' va abans que 'b'
    //   - zero    → ordre indiferent
    //   - positiu → 'b' va abans que 'a'
    return history.sort((a, b) => {
      // Truc per invertir l'ordre amb un sol multiplicador:
      // desc → order = -1 → invertim el signe → 'b' davant 'a'
      // asc  → order = +1 → sense canvis       → 'a' davant 'b'
      const order = this.sortOrder() === 'desc' ? -1 : 1;

      if (this.sortBy() === 'date') {
        // .getTime() converteix un Date a mil·lisegons (número).
        // Restar dos timestamps dona la diferència en ms: negatiu = 'a' és anterior.
        return (a.date.getTime() - b.date.getTime()) * order;
      }
      if (this.sortBy() === 'amount') {
        return (a.total - b.total) * order;
      }
      // localeCompare: compara strings tenint en compte accents, majúscules i l'idioma.
      // Millor que a > b per a alfabètics, perquè "é" i "e" s'ordenen correctament.
      return a.clientName.localeCompare(b.clientName) * order;
    });
  });


  // ─────────────────────────────────────────────────────────────
  // BLOC 4: CONSTRUCTOR
  // Angular l'executa una sola vegada quan crea el servei.
  // Aquí iniciem la càrrega de dades de Supabase.
  // No posem lògica complexa al constructor — només "engegar" coses.
  // ─────────────────────────────────────────────────────────────

  constructor() {
    // No necessitem await aquí: fetchBudgets és async i actualitzarà
    // budgetHistory quan Supabase respongui. La UI ja és reactiva.
    this.fetchBudgets();
  }


  // ─────────────────────────────────────────────────────────────
  // BLOC 5: MÈTODES ASYNC — operacions amb Supabase
  //
  // Patró async/await:
  //   - 'async' marca la funció com a asíncrona (retorna una Promise)
  //   - 'await' pausa l'execució DINS la funció fins que la Promise resol
  //   - L'aplicació segueix responent mentre s'espera (no bloqueja el navegador)
  //
  // Patró try/catch/finally:
  //   - try:     el camí feliç (tot va bé)
  //   - catch:   gestió d'errors (Supabase falla, no hi ha xarxa, etc.)
  //   - finally: sempre s'executa (sigui error o èxit) — ideal per treure spinners
  // ─────────────────────────────────────────────────────────────

  // Carrega tots els pressupostos de Supabase.
  async fetchBudgets() {
    this.isLoading.set(true);  // mostrem spinner a la UI
    this.error.set(null);      // netegem qualsevol error anterior

    try {
      // Desestructurem { data, error }: Supabase sempre retorna un objecte
      // amb exactament aquests dos camps. Si tot va bé, data conté les files
      // i error és null. Si falla, data és null i error conté el missatge.
      const { data, error } = await this.api.getBudgets();

      // Convertim l'error de Supabase (objecte) en excepció de JavaScript
      // per poder gestionar-ho uniformement al bloc catch.
      if (error) throw error;

      // BudgetMapper.fromRemote: transforma cada fila de Supabase (snake_case)
      // a l'interface Budget (camelCase). Deleguem la transformació al Mapper
      // en lloc de fer-ho aquí per mantenir el servei net.
      // (data || []) per si data fos null tot i que no hi hagi error.
      const mapped = (data || []).map(BudgetMapper.fromRemote);
      this.budgetHistory.set(mapped); // signal actualitzat → la UI es refresca sola
    } catch (err: any) {
      // Template literal per combinar text fix i el missatge d'error dinàmic.
      // err.message és la propietat estàndard de qualsevol Error de JavaScript.
      this.error.set(`Error carregant historial: ${err.message}`);
    } finally {
      this.isLoading.set(false); // amaguem el spinner sempre, hagi anat bé o malament
    }
  }

  // Insereix un nou pressupost i refresca la llista.
  async addBudget(newBudget: Budget) {
    this.isLoading.set(true);
    try {
      // BudgetMapper.toRemote converteix de camelCase → snake_case per Supabase.
      // Separant la transformació al Mapper, si el format de la BD canvia
      // només cal tocar el Mapper, no aquest servei.
      const remoteData = BudgetMapper.toRemote(newBudget);
      const { error } = await this.api.saveBudget(remoteData);
      if (error) throw error;

      // Refresquem la llista per incloure el nou pressupost amb la seva ID real de BD.
      await this.fetchBudgets();
    } catch (err: any) {
      this.error.set(`Error en guardar: ${err.message}`);
      // Re-llancem l'error perquè el component que ha cridat addBudget()
      // pugui reaccionar (per exemple, mostrar un alert o no buidar el formulari).
      // Sense aquest 'throw', el try/catch del component mai s'activaria.
      throw err;
    } finally {
      this.isLoading.set(false);
    }
  }

  // Elimina un pressupost per ID.
  async deleteBudget(id: number) {
    this.isLoading.set(true);

    try {
      const { error } = await this.api.deleteBudget(id);
      if (error) throw error;

      // Optimització: en lloc de fer un fetch complet, actualitzem el signal
      // localment filtrant l'element esborrat.
      // .update() rep una funció (b => ...) que transforma el valor actual del signal.
      // És com .set() però quan el nou valor depèn del valor anterior.
      this.budgetHistory.update((budgets) => budgets.filter((b) => b.id !== id));
    } catch (err: any) {
      this.error.set(`Error en esborrar: ${err.message}`);
    } finally {
      this.isLoading.set(false);
    }
  }

  // Inverteix isSelected del servei identificat per 'id'.
  updateServiceSelection(id: string) {
    // .update() rep la funció transformadora: prevServices → nouArray.
    // .map() recorre tots els serveis: si l'id coincideix, invertim isSelected;
    // si no, retornem el servei sense canvis.
    //
    // Spread { ...s, isSelected: !s.isSelected }:
    // Crea un NOU objecte copiant totes les propietats de 's' i sobreescrivint
    // isSelected. Això garanteix immutabilitat: no mutem l'objecte original,
    // i Angular detecta el canvi correctament.
    this.services.update((prevServices) =>
      prevServices.map((s) => (s.id === id ? { ...s, isSelected: !s.isSelected } : s)),
    );
  }

  // Restableix tots els filtres als valors per defecte.
  // Cridat des del botó "Netejar filtres" del BudgetSearch.
  resetFilters() {
    this.searchTerm.set('');
    this.sortBy.set('date');
    this.sortOrder.set('desc');
  }
}
