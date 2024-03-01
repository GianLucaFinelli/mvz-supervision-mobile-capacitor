import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/@core/services';

@Injectable({
	providedIn: 'root',
})
export class RegistarCuentaService extends ApiService<any> {
	constructor(http: HttpClient, router: Router) {
		super(http, 'transportistas', router);
	}
}

