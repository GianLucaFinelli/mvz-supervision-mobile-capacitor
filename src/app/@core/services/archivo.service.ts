import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { environment } from "src/environments/environment";
import { getApiUrl } from "../config/config-path";


@Injectable({
	providedIn: 'root',
})
export class ArchivoService {
	constructor(private http: HttpClient) {
	}

	getBase64ByArchivoId(archivoId: number): Observable<string> {
		let url = '/get-base64-archivos-by-id/' + archivoId;
		return this.http.get(getApiUrl(environment.storage + "/archivos") + url, { responseType: 'text' });
	}
}
