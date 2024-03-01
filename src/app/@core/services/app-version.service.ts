import { Injectable } from '@angular/core';
import { App, AppInfo } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { forkJoin, Observable, take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Dialog } from '@capacitor/dialog';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ModalController } from '@ionic/angular';
import { getApiUrl } from '../config/config-path';
import { ActualizacionComponent } from 'src/app/features/general/actualizacion/actualizacion.component';

@Injectable({
  providedIn: 'root',
})
export class AppVersionService {
  public versionNumber!: AppInfo;
  constructor(
    private http: HttpClient,
    private modalController: ModalController
  ) {}

  getVersionNumber(): Promise<string> {
    const myVersion = environment.version;
    return new Promise(async (resolve) => {
      if (!Capacitor.isNativePlatform()) {
        resolve(myVersion);
      } else {
        resolve(await (await App.getInfo()).version);
      }
    });
  }

  checkVersion(): void {
    this.getVersionApp().subscribe((backendRequest) => {
      let appVersion = this.quitarPuntos(environment.version);
      let minAndroidMobileVersion = this.quitarPuntos(
        backendRequest.minAndroidMobileVersion
      );
      let minIOSMobileVersion = this.quitarPuntos(
        backendRequest.minIOSMobileVersion
      );
      let currentIOSMobileVersion = this.quitarPuntos(
        backendRequest.currentIOSMobileVersion
      );
      let currentAndroidMobileVersion = this.quitarPuntos(
        backendRequest.currentAndroidMobileVersion
      );
      if (Capacitor.isNativePlatform()) {
        if (Capacitor.getPlatform() === 'android') {
          //es android
          if (
            appVersion >= minAndroidMobileVersion &&
            appVersion < currentAndroidMobileVersion
          ) {
            this.openModal(
              backendRequest.currentAndroidMobileVersion,
              false
            ).then((resp) => {
              resp.present();
            });
          } else if (appVersion < minAndroidMobileVersion) {
            this.openModal(
              backendRequest.currentAndroidMobileVersion,
              true
            ).then((resp) => {
              resp.present();
            });
          }
        } else if (Capacitor.getPlatform() === 'IOS') {
          //es iOS
          if (
            appVersion >= minIOSMobileVersion &&
            appVersion < currentIOSMobileVersion
          ) {
            this.openModal(backendRequest.currentIOSMobileVersion, false).then(
              (resp) => {
                resp.present();
              }
            );
          } else if (appVersion < minIOSMobileVersion) {
            this.openModal(backendRequest.currentIOSMobileVersion, false).then(
              (resp) => {
                resp.present();
              }
            );
          }
        }
      } else {
        this.showConfirm(
          'Ingrese desde su dispositivo móvil para poder actualizar la aplicación'
        );
      }
    });
  }

  openModal = async (nuevaVersion: string, esRequerido: boolean) => {
    let dialog = await this.modalController.create({
      component: ActualizacionComponent,
      componentProps: {
        nuevaVersion: nuevaVersion,
        esRequerido: esRequerido,
      },
    });
    return dialog;
  };

  getVersionApp() {
    let httpHeaders: HttpHeaders = new HttpHeaders();
    const headers = httpHeaders.set('Content-Type', 'application/json');

    let url = getApiUrl(environment.modulo + '/');
    return this.http.get<any>(url + 'version', { headers });
  }

  quitarPuntos(string: string): string {
    let newString = '';
    if(string != undefined) {
      for (const caracter of string) {
        if (caracter !== '.') {
          newString += caracter;
        }
      }
    }

    return newString;
  }

  showConfirm = async (message: any) => {
    const { value } = await Dialog.confirm({
      title: 'Actualización disponible',
      message: message,
    });
  };
}
