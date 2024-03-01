import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'general/login',
    pathMatch: 'full',
  },
  {
    path: 'general',
    loadChildren: () =>
      import('./features/general/general.routes').then((m) => m.GENERAL_ROUTES),
  },
  {
    path: 'supervision',
    loadChildren: () =>
      import('./features/supervision/supervision.routes').then(
        (m) => m.SUPERVISION_ROUTES
      ),
  },
  // { path: '**', redirectTo: 'supervision/inicio' },

];
