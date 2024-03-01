import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { getApiUrl } from 'src/app/@core/config/config-path';
import { AuthService } from './auth.service';
import { AplicacionPermitida } from '../models/aplicacion-permitida.model';
@Injectable({ providedIn: 'root' })
export class AplicacionService {

  private readonly API_ENDPOINT_APPLICATION = '/aplicaciones';
  constructor(private http: HttpClient, private authService: AuthService) { }

  getAplicacionesPermitidas(): Observable<AplicacionPermitida[]> {
    // const token = this.authService.getToken();
    // const httpOptions = {
    //   headers: new HttpHeaders()
    //     .set('Content-Type', 'application/json; charset=utf-8')
    //     .set('AppTenantId', environment.tenantId)
    //     .set('Authorization', `Bearer ${token}`)
    // };

    return this.http
      .get<AplicacionPermitida[]>(
        getApiUrl(environment.general + this.API_ENDPOINT_APPLICATION + '/aplicaciones-permitidas'))
  }
}
