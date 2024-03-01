import { Injectable } from '@angular/core';
import { NotificationService } from './notification.service';
import { NavController } from '@ionic/angular';
import { App } from '@capacitor/app';

@Injectable({
  providedIn: 'root',
})
export class BackbuttonExitBaseService {
  counter = 0;

  constructor(
    private notificationService: NotificationService,
    private navCtrl: NavController
  ) {}
  // root: Dos veces intenta salir
  // parent: Es opción de menu con back vuelve a viajes disponibles
  // child: Vuelve al padre
  onBackButtonPress(type: string) {
    if (type == 'parent') {
      this.counter = 0;
      this.navCtrl.navigateForward('/transporte/viajes-disponibles');
    } else if (type == 'child') {
      this.counter = 0;
      this.navCtrl.navigateForward('/transporte/viajes-disponibles');
    } else if (type == 'root') {
      if (this.counter === 0) {
        this.counter++;
        this.notificationService.showBackMessage();
        setTimeout(() => {
          this.counter = 0;
        }, 3000);
      } else {
        App.exitApp();
      }
    }
  }
}
