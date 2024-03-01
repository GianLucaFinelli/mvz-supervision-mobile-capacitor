import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AlertController, IonicModule } from '@ionic/angular';
import { MvzMenuButton } from 'src/app/@core/components';
import { LocalStorageData } from '../../@core/local-storage.data';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.page.html',
  styleUrls: ['./logs.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, MvzMenuButton],
})
export class LogsPage implements OnInit {
  public logs: any;
  public cameraLogs: any;
  public cameraImgLogs: any;
  public customMode: string = '';
  constructor(
    public navRouter: Router,
    public alertCtrl: AlertController,
    private localStorageData: LocalStorageData,
  ) {
    this.logs = this.localStorageData.getLoggerRegisters();
    this.customMode = this.localStorageData.getCustomMode();
  }

  ngOnInit() {
    console.log();
  }


  exit() {
    // this.events.publish('logout');
  }

  borrarRegistrosLocales() {
    this.localStorageData.setLastSyncDate('');
    this.localStorageData.setLoggerRegisters(null);
    this.logs = null;
  }

  async confirm() {
    let alert = await this.alertCtrl.create({
      header: '¿Borrar Registros Locales?',
      message: 'Esto borrara TODO su progreso que no este sincronizado.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => { },
        },
        {
          text: 'Confirmar',
          handler: () => {
            this.borrarRegistrosLocales();
          },
        },
      ],
    });
    await alert.present();
  }

}
