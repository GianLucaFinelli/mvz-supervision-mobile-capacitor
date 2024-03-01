import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { getApiUrl } from "src/app/@core/config/config-path";
import { LocalStorageData } from "src/app/features/supervision/@core/local-storage.data";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class FilesManagmentService {

  loggedUser: any;

  constructor(
    private http: HttpClient,
    private localStorageData: LocalStorageData,
  ) { }

  dataURLtoFile(dataurl: any) {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    const blobFile = new Blob([u8arr], { type: mime });
    return blobFile;
  }

  uploadHash(files: any, entity: string): Observable<any> {
    if (files.length === 0) {
      throw new Error("Debe cargar un archivo.");
    }
    let storageUrl = getApiUrl(environment.storage + '/archivos/upload');
    const headers = new HttpHeaders();
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('file', files[i], files[i].name);
    }
    formData.append('Entity', entity);

    return this.http
      .post(storageUrl, formData, { headers: headers });
      // .map((res: any) => res.json());
  }

  cleanBase64String(base64String: string): string {
    return base64String.replace(/(?:\r\n|\r|\n|\s)/g, '');
  }

  base64ToBlob(base64String: string, contentType: string = ''): Blob {
    const cleanedBase64String = this.cleanBase64String(base64String);
    const byteCharacters = atob(cleanedBase64String);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: contentType });
  }

  blobToFile(blob: Blob, filename: string): File {
    return new File([blob], filename, { type: blob.type, lastModified: Date.now() });
  }

}
