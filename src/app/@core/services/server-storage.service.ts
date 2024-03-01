import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ServerStorageService {
  constructor() {}

  getServerInfo() {
    let server = localStorage.getItem('serverConfig');
    if (server && server !== '') {
      const serverConfig = localStorage.getItem('serverConfig');
      if (serverConfig) {
        return JSON.parse(serverConfig);
      }
    }
  }

  setServerInfo(element: any) {
    localStorage.setItem('serverConfig', JSON.stringify(element));
  }
}
