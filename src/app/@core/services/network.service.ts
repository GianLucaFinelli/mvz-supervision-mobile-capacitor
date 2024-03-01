import { ConnectionStatus, Network } from '@capacitor/network';
import { Injectable } from '@angular/core';
import { NotificationService } from './notification.service';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class NetworkService {
  constructor(
    private notificationService: NotificationService,
    private platform: Platform
  ) {}

  async setup() {
    if (this.platform.is('android')) {
      const networkStatus: ConnectionStatus = await Network.getStatus();
      const isOnline = networkStatus.connected;
      if (!isOnline) {
        this.notificationService.showMessage(
          'No se ha detectado conexión a internet.'
        );
      }
      Network.addListener('networkStatusChange', (status) => {
        if (!status.connected) {
          this.notificationService.showMessage(
            'Se perdió la conexión de datos.'
          );
        }
      });
    } else {
      const isOnline = navigator.onLine;
      if (!isOnline) {
        this.notificationService.showMessage(
          'No se ha detectado conexión a internet.'
        );
      }
    }
  }

  async online(): Promise<boolean> {
    if (this.platform.is('android')) {
      const networkStatus: ConnectionStatus = await Network.getStatus();
      return networkStatus.connected;
    } else {
      return navigator.onLine;
    }
  }

  async validate(): Promise<boolean> {
    if (await this.online()) {
      return true;
    }
    this.notificationService.showMessage(
      'No se detectó conexión de datos para poder realizar la acción solicitada.'
    );
    return false;
  }

  async validateForInterceptor(): Promise<boolean> {
    if (await this.online()) {
      return true;
    }
    return false;
  }
}
