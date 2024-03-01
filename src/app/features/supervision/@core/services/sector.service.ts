import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { getApiUrl } from 'src/app/@core/config/config-path';
import { ApiService } from 'src/app/@core/services';
import { AuthService } from 'src/app/features/general/@core/services';
import { environment } from 'src/environments/environment';
import { Sector } from '../models/sector.model';

@Injectable({
  providedIn: 'root'
})
export class SectorService extends ApiService<Sector> {
	constructor(http: HttpClient, router: Router, private authService: AuthService) {
		super(http, 'sectores', router);
	}

  QrsInspeccion() {
    return this.get('/qrs-inspeccion');
  }
}
