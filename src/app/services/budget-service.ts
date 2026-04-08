import { supabase } from './../config/supabase.config';
import { Injectable, signal, computed, inject } from '@angular/core';
import { Service } from '../interfaces/service.interface';
import { Budget } from '../interfaces/budget.interface';
import { services } from '../core/data/services-obj';
import { SupabaseClient } from '@supabase/supabase-js';


@Injectable({
  providedIn: 'root', // Aquest servei està disponible a tota l'aplicació (singleton global)
})
export class BudgetService {
  private supabase = inject(SupabaseClient); // Injectem el client de Supabase per fer crides a la BD


  // --- 1. ESTAT DE DADES REACTIVES---
  // Els signals són com variables especials: quan canvien, Angular
  // actualitza automàticament tots els components que les utilitzen.
  services = signal<Service[]>(services); // Llista de serveis disponibles (carregada des de l'arxiu de dades local)
  numPages = signal(1); //1 --> valor q apareix x defecte
  numLanguages = signal(1);
  budgetHistory = signal<Budget[]>([]); //<Budget[]> defineix tipus, i ([]) estableix com a valor inicial del signal un array buit


  // --- 2. ESTAT DE LA UI (Filtres/Ordre) ---
  // Signals que controlen com es mostren els pressupostos a la vista.
  searchTerm = signal<string>(''); // Text que l'usuari escriu per filtrar per nom
  sortBy = signal<'date' | 'name' | 'amount'>('date'); // Camp pel qual s'ordena (per defecte: data)
  sortOrder = signal<'asc' | 'desc'>('desc'); // Direcció de l'ordre (per defecte: més recent primer)


  // --- 3. CÀLCULS DERIVATS (Computed) ---
  // Els computed es recalculen automàticament quan canvia
  // qualsevol signal del qual depenen.


   // Calcula el preu total segons els serveis seleccionats i les opcions de web
  totalPrice = computed(() => {
      // Suma els preus de tots els serveis que estan marcats com a seleccionats
    let total = this.services()
      .filter((service) => service.isSelected)
      .reduce((acc, service) => acc + service.price, 0);


     // Si el servei 'web' està seleccionat, afegim el cost extra per pàgines i idiomes. Cada pàgina i cada idioma costa 30€
    const isWebSelected = this.services().find((service) => service.id === 'web')?.isSelected;
    if (isWebSelected) {
      total += (this.numPages() + this.numLanguages()) * 30;
    }


    return total;
  });


  // Retorna la llista de pressupostos filtrada i ordenada segons l'estat de la UI
  filteredBudgets = computed(() => {
    let history = [...this.budgetHistory()]; // Còpia de l'array per no mutar l'original
    const term = this.searchTerm().toLowerCase();


    // Primer filtre ràpid: si hi ha text de cerca, eliminem els que no coincideixen
    if (term) {
      history = history.filter((b) => b.clientName.toLowerCase().includes(term));
    }


     // Ordenem segons el camp i la direcció actuals
    history.sort((a, b) => {
      if (this.sortBy() === 'date') {
        // Comparem timestamps (getTime() retorna mil·lisegons)
        return this.sortOrder() === 'desc'
          ? b.date.getTime() - a.date.getTime() // desc: el + recent 1r
          : a.date.getTime() - b.date.getTime(); // asc: el + antic 1r
      }


      if (this.sortBy() === 'amount') {
        // Comparem imports numèricament
        return this.sortOrder() === 'desc' ? b.total - a.total : a.total - b.total;
      }


      if (this.sortBy() === 'name') {
        // localeCompare ordena alfabèticament tenint en compte accents i idioma
        const comparison = a.clientName.localeCompare(b.clientName);
        return this.sortOrder() === 'asc' ? comparison : comparison * -1; // -1 inverteix l'ordre
      }


      return 0; // Si no coincideix cap cas, no canviem l'ordre
    });


    // Si no hi ha terme de cerca, retornem tota la llista ordenada
    if (!term) return history;


    // Si hi ha terme, tornem a filtrar (sobre la llista ja ordenada)
    return history.filter((b) => b.clientName.toLowerCase().includes(term));
  });


  // --- 4. CONSTRUCTOR ---
  // S'executa automàticament quan Angular crea el servei (una sola vegada).
  constructor() {
    this.fetchBudgets(); // Carreguem els pressupostos de Supabase en arrencar
  }


  // --- 5. MÈTODES D'ACCIÓ ---
  // Funcions que interactuen amb Supabase o modifiquen l'estat.
  // Les funcions async/await "esperen" la resposta de Supabase
  // abans de continuar, evitant problemes de sincronització.


  // Carrega tots els pressupostos de Supabase i actualitza el signal
  async fetchBudgets() {
    const { data, error } = await supabase  // await: esperem que Supabase respongui
      .from('budgets')
      .select('*') // Seleccionem totes les columnes
      .order('created_at', { ascending: false }); // Els més recents primer


    if(error) {
      console.error(error.message);
      return;
    }


    if (data) {
      // Supabase retorna noms en snake_case (client_name), els mapem a camelCase (clientName), per seguir les convencions d'Angular/TypeScript
      const mappedBudgets: Budget[] = data.map((b: any) => ({
        id: b.id,
        clientName: b.client_name,
        clientEmail: b.client_email,
        clientPhone: b.client_phone,
        total: b.total,
        services: b.services,
        date: new Date(b.created_at), // Convertim el string de data a objecte Date de JavaScript
      }));
      this.budgetHistory.set(mappedBudgets); // Actualitzem el signal → la UI es refresca sola
    }
  }


  // Insereix un nou pressupost a Supabase i refresca la llista
  async addBudget(newBudget: Budget) { // Aquí només desestructurem { error } perquè no ens interessa el que Supabase retorna: només volem saber si l'operació ha fallat o no
    const { error } = await supabase.from('budgets').insert([
      {
        // Tornem a convertir de camelCase a snake_case per a Supabase
        client_name: newBudget.clientName,
        client_email: newBudget.clientEmail,
        client_phone: newBudget.clientPhone,
        total: newBudget.total,
        services: newBudget.services,
      },
    ]);


    if (!error) {
      // Només refresquem la llista si ha anat bé. await aquí és important: esperem que el fetch acabi abans de continuar (si hi hagués més codi a sota)
      await this.fetchBudgets();
    }
  }


  // Elimina un pressupost per ID de Supabase i actualitza el signal localment
  async deleteBudget(id: number) {
    const { error } = await this.supabase
    .from('budgets')
    .delete()
    .eq('id', id); // eq = "equal": esborra on id = el valor que passem


    if (error) {
      console.error('Error en esborrar:', error); // Mostrem l'error a la consola del navegador i sortim sense actualitzar
      return;
    }


    // Si no hi ha error, actualitzem el signal filtrant el pressupost esborrat. Això evita fer un fetch complet: és més ràpid i eficient.
    this.budgetHistory.update(budgets => budgets.filter(b => b.id !== id));
    }


  // Inverteix l'estat isSelected del servei amb l'id indicat
  updateServiceSelection(id: string) {
    this.services.update((prevServices) =>
      // Si és el servei que busquem, invertim isSelected; si no, el deixem igual
      prevServices.map((s) =>
        s.id === id ? { ...s, isSelected: !s.isSelected } : s,
      ),
    );
  }


  // Restableix tots els filtres als valors per defecte
  resetFilters() {
    this.searchTerm.set('');
    this.sortBy.set('date');
    this.sortOrder.set('desc');
  }
}



