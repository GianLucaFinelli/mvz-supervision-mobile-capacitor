import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { AccessData } from "src/app/@core/models";
import { environment } from "src/environments/environment";
import { getApiUrl } from "../../../../@core/config/config-path";
import { LoginModel } from "../models";

@Injectable({
  providedIn: 'root',
})
export class AuthService  {
  private API_ENDPOINT_LOGIN = '/auth/token';
  private API_ENDPOINT_RECOVER_PASSWORD = '/auth/resetear-password';
  private API_ENDPOINT_CHANGE_PASSWORD = '/auth/cambiar-password';

  constructor(
    private http: HttpClient
  ) {

  }

  changePassword(entity: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('AppTenantId', environment.tenantId),
    };
    return this.http
      .post(
        getApiUrl(environment.general + this.API_ENDPOINT_CHANGE_PASSWORD),
        entity,
        httpOptions
      )
  }

  public isAuthorized(): Observable<boolean> {
    if (!this.getToken() || this.hasTokenExpired()) {
      return of(false);
    }
    return of(true);
  }

  isAuthAuthorized(): boolean {
    if (!this.getToken() || this.hasTokenExpired()) {
      return false;
    }
    return true;
  }


  login(credential: LoginModel): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json; charset=utf-8')
        .set('AppTenantId', environment.tenantId)
    };

    const login = {
      userName: credential.userName,
      password: credential.password,
    };

    return this.http
      .post<AccessData>(
        getApiUrl(environment.general + this.API_ENDPOINT_LOGIN),
        JSON.stringify(login),
        httpOptions
      )
  }

  logout() {
    // localStorage.clear();
    localStorage.removeItem('token');
    if(localStorage.getItem('loggedPass') && localStorage.getItem('loggedPass') == 'false') {
      localStorage.removeItem('loggedPass');
      localStorage.removeItem('loggedUser');
    }
  }

  public recuperarPassword(userName: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
    };
    var url =  getApiUrl(environment.general + this.API_ENDPOINT_RECOVER_PASSWORD) + "/" + userName;
    return this.http.post(url,httpOptions);
  }

  hasTokenExpired() {
    /*const current_date = new Date();
    const validTo = this.getTokenValidToDate();
    return (!validTo || (validTo.getTime() < current_date.getTime()));*/
    return false;
  }

  setToken(token: string) {
    if (token){
    this.setTokenValidToDate(new Date());
    localStorage.setItem('token', window.btoa(token));
    }
  }

  getToken(): string {
    let token = localStorage.getItem('token');
    if (token) {
      return token;
    }
    return '';
  }

  public getAccessToken(): Observable<string> {
    return of(this.getToken());
  }

  setTokenValidToDate(date: Date) {
    if (date) {
      localStorage.setItem('token-valid-to', window.btoa(date.toString()));
    }
  }

  getTokenValidToDate(): Date| null {
    let date = localStorage.getItem('token-valid-to');
    if (date) {
      let dateDecode = window.atob(date);
      return new Date(dateDecode);
    }
    return null;
  }
}

