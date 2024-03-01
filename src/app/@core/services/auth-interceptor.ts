import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor() { }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    // Se toma los valores del env
    let env = environment;
    // Evitamos que se intercepten url de otros sistemas
    const baseUrls = [env.apiBaseUrl, env.apiProdBaseUrl, env.apiDevBaseUrl, env.apiUATBaseUrl, env.apiTestBaseUrl, env.modulo];
    if (!baseUrls.some(url => req.url.includes(url))) {
      return next.handle(req);
    }

    // Sacamos el request si está habilitado en environement
    if (env.publicUrls.some(url => req.url.includes(url))) {
      return next.handle(req);
    }

    let token = localStorage.getItem('token');
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    // Obtenemos la aplicaciónId del localStorage
    let getStorageAplicacionId = localStorage.getItem('aplicacionId');
    if(getStorageAplicacionId) {
      req = req.clone({
        setHeaders: {
          Aplicacionid: `${getStorageAplicacionId}`,
        },
      });
    }
    else { // la obtenemos del env
      let aplicacionId = env.aplicacionId;
      if (aplicacionId) {
        req = req.clone({
          setHeaders: {
            Aplicacionid: `${aplicacionId}`,
          },
        });
      }
    }


    let cuentaId = localStorage.getItem('cuentaId');
    if (cuentaId) {
      req = req.clone({
        setHeaders: {
          Cuentaid: `${cuentaId}`,
        },
      });
    }

    let appTenantId = env.tenantId;
    if (appTenantId) {
      req = req.clone({
        setHeaders: {
          AppTenantId: `${appTenantId}`,
        },
      });
    }

      return next.handle(req);
    }

  }

