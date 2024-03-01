import { AuthService } from './../../../general/@core/services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { getApiUrl } from 'src/app/@core/config/config-path';
import { ApiService } from 'src/app/@core/services';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VisitaService extends ApiService<any> {
	constructor(http: HttpClient, router: Router, private authService: AuthService) {
		super(http, 'visitas', router);
	}

  ServerDatetime() {
    return this.http.get(this.getApiServiceUrl() + '/server-datetime');
  }
}
