import { Routes } from '@angular/router';

export const GENERAL_ROUTES: Routes = [
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('../../features/general/login/login.page').then(
        (m) => m.LoginPage
      ),
  },
  {
    path: 'pre-login',
    loadComponent: () =>
      import('../../features/general/login/pre-login/pre-login.page').then(
        (m) => m.PreLoginPage
      ),
  },
  {
    path: 'olvide-contrasenia',
    loadComponent: () =>
      import(
        '../../features/general/olvide-contrasenia/olvide-contrasenia.page'
      ).then((m) => m.OlvideContraseniaPage),
  },
  {
    path: 'configuracion',
    loadComponent: () =>
      import('../../features/general/configuracion/configuracion.page').then(
        (m) => m.ConfiguracionPage
      ),
  },
  {
    path: 'acerca-de',
    loadComponent: () =>
      import('../../features/general/acerca-de/acerca-de.page').then(
        (m) => m.AcercaDePage
      ),
  },
  {
    path: 'notificaciones',
    loadComponent: () =>
      import('../../features/general/notificaciones/notificaciones.page').then(
        (m) => m.NotificacionesPage
      ),
  },
  {
    path: 'cambiar-password',
    loadComponent: () =>
      import('./cambiar-password/cambiar-password.page').then(
        (m) => m.CambiarpasswordPage
      ),
  },
  {
    path: 'mi-perfil',
    loadComponent: () =>
      import('../../features/general/mi-perfil/mi-perfil.page').then(
        (m) => m.MiPerfilPage
      ),
  },
];
