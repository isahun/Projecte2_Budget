import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { supabase } from './config/supabase.config';
import { SupabaseClient } from '@supabase/supabase-js';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    { provide: SupabaseClient, useValue: supabase }
  ]
};
