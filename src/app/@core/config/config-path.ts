import { environment } from 'src/environments/environment';

export function getApiUrl(url: string) {
  let storageServerConfig = localStorage.getItem('serverConfig');

  // En el caso de desarrollo podría darse el caso que estamos corriendo el módulo transporte local para depurar y general o storage en otro entorno.
  // En producción no deberíamos pasar nunca l url completa porque anularíamos el cambio de contexto con el pre-login
  if (!environment.production && url.startsWith('http')) {
    return url;
  } else {
    let formatedUrl = '';
    let formatedBaseUrl = '';
    if (url && url.startsWith('/')) {
      formatedUrl = url.substring(1, url.length);
    } else {
      formatedUrl = url;
    }
    if (storageServerConfig) {
      const serverConfig = JSON.parse(storageServerConfig);
      if (serverConfig.url) {
        formatedBaseUrl = serverConfig.url.substring(
          0,
          serverConfig.url.length - 1
        );
      }
    } else if (environment.apiBaseUrl && environment.apiBaseUrl.endsWith('/')) {
      formatedBaseUrl = environment.apiBaseUrl.substring(
        0,
        environment.apiBaseUrl.length - 1
      );
    } else {
      formatedBaseUrl = environment.apiBaseUrl;
    }
    return formatedBaseUrl + '/' + formatedUrl;
  }
}

export function getBaseUrl() {
  return environment.apiBaseUrl;
}
