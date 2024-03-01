import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { Cuenta } from '../models/cuenta.model';
import { getApiUrl } from 'src/app/@core/config/config-path';

@Injectable({providedIn: 'root'})
export class CuentaService {

  private readonly API_ENDPOINT_APPLICATION = '/cuentas';
  constructor(private http: HttpClient, private authService: AuthService) { }

  getAplicacionesPermitidas(aplicacionId: number): Observable<Cuenta[]> {
    return this.http
      .get<Cuenta[]>(
        getApiUrl(environment.general + this.API_ENDPOINT_APPLICATION + '/mis-cuentas'))
  }

}
