import { inject, Injectable } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable({ providedIn: 'root' })
export class BudgetApiService {
  private supabase = inject(SupabaseClient);

  getBudgets() {
    return this.supabase.from('budgets').select('*').order('created_at', { ascending: false });
  }

  saveBudget(data: any) {
    return this.supabase.from('budgets').insert([data]);
  }

  deleteBudget(id: number){
    return this.supabase.from('budgets').delete().eq('id', id);
  }
}
