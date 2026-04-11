// ============================================================
// BUDGET API SERVICE — capa d'accés a dades (Supabase)
//
// Responsabilitat ÚNICA: fer les crides HTTP a Supabase.
// No conté lògica de negoci ni transforma dades.
//
// Per què separar-ho de BudgetService?
//   1. Si canviem de Supabase a una altra API, només toquem aquest fitxer.
//   2. Als tests de BudgetService podem substituir aquest servei per un mock
//      sense tocar cap crida real de xarxa.
// ============================================================

import { inject, Injectable } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable({ providedIn: 'root' })
export class BudgetApiService {

  // inject(SupabaseClient): Angular ens entrega la instància del client
  // de Supabase que hem registrat a app.config.ts amb:
  //   { provide: SupabaseClient, useValue: supabase }
  // Separar el client en un provider permet substituir-lo per un mock als tests.
  private supabase = inject(SupabaseClient);

  // Retorna TOTS els pressupostos ordenats del més recent al més antic.
  // No usem async/await aquí: retornem la Promise directament perquè
  // BudgetService ja gestiona l'await i els errors amb try/catch.
  getBudgets() {
    return this.supabase
      .from('budgets')
      .select('*')                              // totes les columnes
      .order('created_at', { ascending: false }); // DESC: el més recent primer
  }

  // Insereix una nova fila. 'data' ve ja en format snake_case (gràcies al Mapper).
  // L'array [...data] és per si Supabase requereix inserció en lot (batch insert).
  saveBudget(data: any) {
    return this.supabase.from('budgets').insert([data]);
  }

  // Elimina la fila on id coincideix.
  // .eq('id', id) → equivalent SQL: WHERE id = id
  deleteBudget(id: number) {
    return this.supabase.from('budgets').delete().eq('id', id);
  }
}
