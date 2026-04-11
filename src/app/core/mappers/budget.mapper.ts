// ============================================================
// BUDGET MAPPER — transformació de formats de dades
//
// Supabase guarda les columnes en snake_case (client_name, created_at).
// TypeScript/Angular usa camelCase (clientName, date) per convenció.
//
// El Mapper és la "frontera" entre els dos mons: conté tota la lògica
// de transformació en un sol lloc. Si el nom d'una columna canvia a
// la BD, només cal modificar aquest fitxer.
//
// Mètodes estàtics: no cal instanciar la classe, es criden directament
// com BudgetMapper.fromRemote(b) o BudgetMapper.toRemote(budget).
// ============================================================

import { Budget } from "../../interfaces/budget.interface";

export class BudgetMapper {

  // fromRemote: BD → TypeScript (Supabase → app)
  // 'b: any' perquè Supabase retorna les files sense tipus estricte.
  // El tipus de retorn ': Budget' garanteix que el resultat encaixa amb la interfície.
  static fromRemote(b: any): Budget {
    return {
      id: b.id,
      clientName: b.client_name,       // snake_case → camelCase
      clientEmail: b.client_email,
      clientPhone: b.client_phone,
      total: b.total,
      services: b.services,            // Supabase guarda arrays JSON nativament
      // new Date(string): converteix el string ISO 8601 de Supabase
      // ('2024-03-15T10:30:00Z') a un objecte Date de JavaScript,
      // que permet fer operacions com .getTime() o formatar amb DatePipe.
      date: new Date(b.created_at),
    };
  }

  // toRemote: TypeScript → BD (app → Supabase)
  // No incloem 'id' ni 'date' perquè Supabase els genera automàticament
  // (id és autoincremental, created_at té DEFAULT NOW()).
  static toRemote(budget: Budget) {
    return {
      client_name: budget.clientName,  // camelCase → snake_case
      client_email: budget.clientEmail,
      client_phone: budget.clientPhone,
      total: budget.total,
      services: budget.services,
    };
  }
}
