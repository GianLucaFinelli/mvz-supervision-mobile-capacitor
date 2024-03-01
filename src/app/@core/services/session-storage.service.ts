import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root',
})
export class SessionStorageService {
  constructor() {}

  getLoggedUser(): string | undefined {
    const loggedUser = localStorage.getItem('loggedUser');
    if (loggedUser) {
      return loggedUser;
    }
    return undefined;
  }

  getIsAuthenticated(): boolean {
    if (
      localStorage.getItem('is-authenticated') &&
      localStorage.getItem('is-authenticated') === 'true'
    ) {
      return true;
    }
    return false;
  }

  getLoggedPass(): any {
    return localStorage.getItem('loggedPass');
  }

  getRememberMe(): boolean {
    // Por defecto si no tiene nada preseteado tomamos que quiere recordar
    // 0011353: Etapa 3-A - Incidencia 65359- Sugerir Recordarme + Autologin idem facebook
    if (
      !localStorage.getItem('rememberMe') ||
      localStorage.getItem('rememberMe') === 'true'
    ) {
      return true;
    }
    return false;
  }

  setLoggedUser(user: string) {
    localStorage.setItem('loggedUser', user);
  }

  setLoggedPass(password: string) {
    localStorage.setItem('loggedPass', password);
  }

  setRememberMe(rememberMe: boolean | null) {
    if (rememberMe) {
      localStorage.setItem('rememberMe', rememberMe.toString());
    }
  }

  setServerInfo(element: any) {
    localStorage.setItem('serverConfig', JSON.stringify(element));
  }
}
