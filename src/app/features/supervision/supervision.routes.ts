import { Routes } from '@angular/router';

export const SUPERVISION_ROUTES: Routes = [
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full',
  },
  {
    path: 'inicio',
    loadComponent: () => import('./pages/inicio/inicio.page').then( m => m.InicioPage)
  },
  {
    path: 'logs',
    loadComponent: () => import('./pages/logs/logs.page').then( m => m.LogsPage)
  },
  {
    path: 'scan-qr',
    loadComponent: () => import('./pages/sector/scan-qr/scan-qr.page').then( m => m.ScanQrPage)
  },
  {
    path: 'inspeccion-listado',
    loadComponent: () => import('./pages/sector/punto-inspeccion-list/punto-inspeccion-list.page').then( m => m.PuntoInspeccionListPage)
  },
  {
    path: 'inspeccion',
    loadComponent: () => import('./pages/sector/punto-inspeccion-edit/punto-inspeccion-edit.page').then( m => m.PuntoInspeccionEditPage)
  },
];
