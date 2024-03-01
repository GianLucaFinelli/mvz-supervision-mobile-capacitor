import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/@core/services';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root',
})
export class DispositivoService extends ApiService<any> {

    constructor(http: HttpClient, router: Router, private authService: AuthService) {
        super(http, 'dispositivos', router);
    }

    registrarDispositivo(token: string) {
        return this.post<any>(`/registrar`, { token: token  });
    }
}
