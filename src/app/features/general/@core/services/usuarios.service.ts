import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { getApiUrl } from 'src/app/@core/config/config-path';
import { ApiService } from 'src/app/@core/services';
import { environment } from 'src/environments/environment';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService extends ApiService<any> {
	constructor(http: HttpClient, router: Router) {
		super(http, 'usuarios', router);
	}

  MiPerfil() {
    // return this.get(getApiUrl(environment.general + '/usuarios/mi-perfil'));
    return this.http.get<Usuario>(getApiUrl(environment.general + '/usuarios/mi-perfil'))
  }
}
