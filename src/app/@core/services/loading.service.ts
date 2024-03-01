import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  loadingElement: HTMLIonLoadingElement;
  constructor(private loadingController: LoadingController) {}

  async show() {
    this.loadingElement = await this.loadingController.create({
      keyboardClose: true,
      message: 'Cargando...',
      translucent: true,
      cssClass: 'custom-class custom-loading',
    });

    await this.loadingElement.present();

    return this.loadingElement;
  }
  async ShowCustomMessage(msg: string) {
    this.loadingElement = await this.loadingController.create({
      keyboardClose: true,
      message: msg,
      translucent: true,
      cssClass: 'custom-class custom-loading',
    });
    await this.loadingElement.present();

    return this.loadingElement;
  }
  async hide() {
    try {
      this.loadingElement.dismiss();
    } catch (e) {}
  }

}
