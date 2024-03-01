import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController, IonicSafeString, ToastController } from '@ionic/angular';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(
    private toastController: ToastController,
    private alertController: AlertController
  ) { }

  async showBackMessage() {
    const toast = await this.toastController.create({
      message: 'Presione nuevamente para salir',
      position: 'bottom',
      duration: 3000,
    });

    toast.present();
  }

  async showMessage(errorInfo: any | HttpErrorResponse, time: number = 3000) {

    const msg = [];
    if (!errorInfo) {
      msg.push("Se produjo un error inesperado.");
    }

    if (errorInfo.error) {
    }
    if (errorInfo.error && Array.isArray(errorInfo.error)) {
        errorInfo.error.forEach((element: any) => {
        msg.push(element);
      });
    }

    if (errorInfo.error && !errorInfo.error.Errors && errorInfo.error.message) {
      msg.push(errorInfo.error.message);
    }

    if (Array.isArray(errorInfo)) {
      errorInfo.forEach((element) => {
        msg.push(element);
      });
    }

    if (msg.length == 0){
      if (errorInfo.message && errorInfo.status == 0){
        msg.push("No se pudo conectar al servidor. Vuelva a intentar en unos minutos.");
      }
      else{
        if (environment.production){
          msg.push("Se produjo un error inesperado.");
        }
        else{
          msg.push(JSON.stringify(errorInfo));
        }
        
      }
        
    }

    this.toastController.getTop().then((result) => {
      if (result) {
        result.dismiss();
      }
    });
    const toast = await this.toastController.create({
      message: new IonicSafeString(msg.join('<br>')),
      position: 'bottom',
      duration: time,
    });
    toast.present();
  }

  async showMessageOnClick(
    message: string | string[],
    funct: any | null,
    time: number = 3000
  ) {
    if (!message) {
      message = 'Se produjo un error inesperado.';
    }
    this.toastController.getTop().then((result) => {
      if (result) {
        result.dismiss();
      }
    });
    const msg = [];
    if (Array.isArray(message)) {
      message.forEach((element) => {
        msg.push(element);
      });
    } else {
      msg.push(message);
    }
    const toast = await this.toastController.create({
      message: new IonicSafeString(msg.join('<br>')),
      position: 'bottom',
      duration: time,
      buttons: [
        {
          text: 'Ver',
          handler: () => {
            if (funct) {
              funct();
            }
          },
        },
      ],
    });

    toast.present();
  }
  async showAlertMessage(
    message: string | string[],
    funct: any | null,
    header: string = 'Confirmación',
    customClass: string = 'alert-default-css'
  ) {
    const alertTop = await this.alertController.getTop();
    if (alertTop) {
      alertTop.dismiss();
      return;
    }
    const msg = [];
    if (Array.isArray(message)) {
      message.forEach((element) => {
        msg.push(element);
      });
    } else {
      msg.push(message);
    }
    const alert = await this.alertController.create({
      header,
      message: new IonicSafeString(msg.join('<br>')),
      cssClass: customClass,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            if (funct) {
              funct();
            }
          },
        },
      ],
      translucent: true,
    });
    await alert.present();
  }

  async showAlertConfirm(
    message: string | string[],
    okFunct: any | null,
    cancelFunct: any | null,
    header: string = 'Confirmación'
  ) {
    const customClass: string = 'alert-default-css';
    const msg = [];
    if (Array.isArray(message)) {
      message.forEach((element) => {
        msg.push(element);
      });
    } else {
      msg.push(message);
    }
    const alert = await this.alertController.create({
      header: header,
      message: new IonicSafeString(msg.join('<br>')),
      cssClass: customClass,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            if (cancelFunct) {
              cancelFunct();
            }
          },
        },
        {
          text: 'OK',
          handler: () => {
            if (okFunct) {
              okFunct();
            }
          },
        },
      ],
    });
    await alert.present();
  }
}
