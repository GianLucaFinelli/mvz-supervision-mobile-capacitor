import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { getApiUrl } from '../config/config-path';
import { QueryParamsModel, QueryResultsModel } from '../models';

export class ApiService<T> {
  constructor(
    protected http: HttpClient,
    protected entityName: string,
    protected router: Router
  ) {}

  protected getApiServiceUrl() {
    return getApiUrl(environment.modulo + "/" +  this.entityName);
  }

  update(entity: T): Observable<any> {
    const httpHeaders = this.getHTTPHeaders();
    const headers = httpHeaders;

    return this.http
      .post(this.getApiServiceUrl() + '/update', entity, {
        headers: headers,
      })
  }

  getAllByCriteria(query: QueryParamsModel): Observable<QueryResultsModel<T>> {
    const headers = this.getHTTPHeaders();

    if (query) {
      const url = this.getApiServiceUrl() + '?' + this.urlParam(query);
      return this.http.get<QueryResultsModel<T>>(url, { headers });
    } else {
      return this.http.get<QueryResultsModel<T>>(this.getApiServiceUrl(), {
        headers,
      });
    }
  }

  getAll(): Observable<QueryResultsModel<T>> {
    const query: QueryParamsModel = {
      searchText: '',
      page: 0,
      pageSize: 19999,
      orderBy: '',
      descendingOrder: false,
    };
    return this.getAllByCriteria(query);
  }


  getString(url: string): Observable<any> {
    return this.http.get(this.getApiServiceUrl() + url, {responseType: 'text'});
  }

  get<T>(url: string): Observable<T> {
    let headers: HttpHeaders = new HttpHeaders();
    return this.http.get<T>(this.getApiServiceUrl() + url, { headers });
  }

  getById(id: number): Observable<T> {
    const httpHeaders = this.getHTTPHeaders();
    const headers = httpHeaders;
    let url = this.getApiServiceUrl();
    return this.http.get<T>(url + `/${id}`, { headers });
  }

  delete(id: any): Observable<any> {
    const httpHeaders = this.getHTTPHeaders();
    const headers = httpHeaders;
    const url = `${this.getApiServiceUrl()}/${id}`;
    return this.http.delete<any>(url, { headers });
  }

  postUrl<R>(url: string): Observable<R> {
    const httpHeaders = this.getHTTPHeaders();
    const headers = httpHeaders;
    return this.http.post<R>(this.getApiServiceUrl() + url, {
      headers: headers,
    });
  }


  post<R>(url: string = '', entity: T): Observable<R> {
    const httpHeaders = this.getHTTPHeaders();
    const headers = httpHeaders;
    return this.http.post<R>(this.getApiServiceUrl() + url, entity, {
      headers: headers,
    });
  }

  customPost<R, T>(url: string = '', entity: T): Observable<R> {
    const httpHeaders = this.getHTTPHeaders();
    const headers = httpHeaders;
    return this.http.post<R>(this.getApiServiceUrl() + url, entity, {
      headers: headers,
    });
  }

  protected getHTTPHeaders(): HttpHeaders {
    let result: HttpHeaders = new HttpHeaders();
    result.set('Content-Type', 'application/json');
    return result;
  }
  /**
   * Build url parameters key and value pairs from array or object
   * @param obj
   */
  urlParam(obj: any): string {
    const maped = Object.keys(obj)
      .filter(
        (val) =>
          obj[val] !== '' &&
          obj[val] !== undefined &&
          obj[val] !== null &&
          obj[val].toString() !== '[object Object]'
      )
      .map((k) => k + '=' + encodeURIComponent(obj[k]))
      .join('&');
    return maped;
  }
}
