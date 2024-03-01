import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/@core/services';

@Injectable({
  providedIn: 'root'
})
export class RutinaService extends ApiService<any> {
	constructor(http: HttpClient, router: Router) {
		super(http, 'visitas', router);
	}
}
