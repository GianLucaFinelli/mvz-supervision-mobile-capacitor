import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AlertController, IonicModule, LoadingController, NavController, Platform } from '@ionic/angular';
import { MvzMenuButton } from 'src/app/@core/components';
import { LocalStorageData } from '../../../@core/local-storage.data';
import { NotificationService } from 'src/app/@core/services';
import { Router } from '@angular/router';
import { SECTOR_STATUS } from '../../../@core/models/enums/sector-status.enum';
import { Geolocation, Position } from '@capacitor/geolocation';
// import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { FormsModule } from '@angular/forms';

import {
  BarcodeScanner,
  BarcodeFormat,
  LensFacing,
} from '@capacitor-mlkit/barcode-scanning';

@Component({
  selector: 'app-scan-qr',
  templateUrl: './scan-qr.page.html',
  styleUrls: ['./scan-qr.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule, MvzMenuButton],
})
export class ScanQrPage implements OnInit {

  showCamera: boolean = false;
  scannedOk: boolean = false;
  manual: boolean = false;
  @Output() selected: EventEmitter<any> = new EventEmitter<any>();

  showBack: boolean = false;
  model: any = null;
  sector: any;
  sectores: any[] = [];
  scannerImg: string;
  scannerMsg: string;
  inspectionPoints: any = [];
  plantStatus: any;
  qrCode: string | null = null;
  public customMode: string = '';
  loggedUser: any;

  constructor(
    private nav: Router,
    private platform: Platform,
    private navCtrl: NavController,
    // private navParams: NavParams,
    private notification: NotificationService,
    public localStorageData: LocalStorageData,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private cdr: ChangeDetectorRef,
    // private geolocation: Geolocation,
    // private diagnostic: Diagnostic
  ) {
  }

  ngOnInit(): void {
    this.loggedUser = this.localStorageData.getUsuarioLogueado();
  }

  ionViewWillEnter() {
    // this.sector = this.navParams.data.items ? this.navParams.data : this.navParams.data.item;
    this.scannerImg = 'assets/icon/scan.png';
    this.scannerMsg = 'Escanee el código QR para acceder.';

    this.sectores = this.localStorageData.getSectores();
    this.customMode = this.localStorageData.getCustomMode();
  }

  // stopScan() {
  //   BarcodeScanner.showBackground();
  //   BarcodeScanner.stopScan();
  //   this.showCamera = false; // oculta la camara
  // };

  async requestPermissions(): Promise<boolean> {
    const { camera } = await BarcodeScanner.requestPermissions();
    return camera === 'granted' || camera === 'limited';
  }

  async presentAlert(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Permission denied',
      message: 'Please grant camera permission to use the barcode scanner.',
      buttons:
      [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => { },
        },
      ],
    });
    await alert.present();
  }

  async stopScan() {
    // Make all elements in the WebView visible again
    document.querySelector('body')?.classList.remove('barcode-scanner-active');
    // Remove all listeners
    await BarcodeScanner.removeAllListeners();
    // Stop the barcode scanner
    await BarcodeScanner.stopScan();
  };

  async scan() {
    console.log("Scan: function");
    this.manual = false;
    this.localStorageData.setManual(false);
    if (this.platform.is('cordova')) {
      BarcodeScanner.isSupported().then( async (result) => {
        if(result.supported) {
          document.querySelector('body')?.classList.add('barcode-scanner-active');
          this.showCamera = true;
          // Add the `barcodeScanned` listener
          const listener = await BarcodeScanner.addListener(
            'barcodeScanned',
            async result => {
              // console.log(result.barcode);
              // console.log("CAMARA ON: ", result)
              if (result.barcode) {
                if (result.barcode.format === BarcodeFormat.QrCode) {
                  this.sector = this.sectores.find((s) => result.barcode.displayValue.localeCompare(s.codigoQR) === 0);
                  if (this.sector !== undefined) {
                    this.scannerImg = 'assets/icon/scan-check.png';
                    this.scannerMsg = 'El código se escaneó con éxito.';
                    this.scannedOk = true;
                    console.log("CAMARA ON: ", result.barcode.displayValue)
                    this.stopScan();
                    this.cdr.detectChanges();
                  } else {
                    this.notification.showMessage('El código QR leido no pertenece a Ningun sector.');
                    this.stopScan();
                    this.cdr.detectChanges();
                  }
                } else {
                  this.notification.showMessage('El código leido no es de tipo QR.');
                  this.stopScan();
                  this.cdr.detectChanges();
                }
              }
              else {
                if (!this.scannedOk) this.notification.showMessage('No se pudo inicializar la cámara');
                this.cdr.detectChanges();
              }
            },
          );
          // Start the barcode scanner
          await BarcodeScanner.startScan({
            formats: [BarcodeFormat.QrCode]
          });
        }
        else {

        }
      });
    } else {
      this.notification.showMessage('La funcionalidad no es compatible con tu dispositivo');
      if (this.localStorageData.getCustomMode() == 'DEV' || this.localStorageData.getCustomMode() == 'TST-NOCAM') {
        //TODO: implementar dotenv ...
        this.sector = this.sectores.find((s) => s.codigoQR === '66');
        if (this.sector !== undefined) {
          this.scannerImg = 'assets/icon/scan-check.png';
          this.scannerMsg = 'El código se escaneó con éxito. (dev mode)';
          this.scannedOk = true;
          this.stopScan();
          this.cdr.detectChanges();
        } else {
          this.notification.showMessage('Código QR invalido. (DEV)');
        }
      }
    }
  }

  async getCurrentPosition() {
    const coordinates = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 30000,
      maximumAge: 30000
    });
    console.log('Current position:', coordinates);
    return coordinates;
  };

  async GpsCheckPermissions() {
    const permissions = await Geolocation.checkPermissions();
    if(permissions.location == 'denied') {
      const requestPermissions = await Geolocation.requestPermissions();
      if(requestPermissions.coarseLocation == 'denied' || requestPermissions.location == 'denied'){
        this.alertCtrl.create({
          header: "Debe aceptar el permiso de GPS para continuar",
          buttons: [
            {
              text: 'Ok',
              role: 'ok',
              handler: async () => {
                const requestPermissions = await Geolocation.requestPermissions();
                if(requestPermissions.coarseLocation == 'denied' || requestPermissions.location == 'denied') {
                  this.GpsCheckPermissions();
                }
              },
            },
            {
              text: 'Cancelar',
              role: 'cancel',
              handler: () => {
                return permissions;
              },
            },
          ]
        })
      }
    }
    return permissions;
  };

  scanManual() {
    console.log("scanManual: function");
    if (this.platform.is('cordova')) {
      this.platform.ready().then(() => {
          this.GpsCheckPermissions().then((hasPermission) => {
            this.getCurrentPosition().then( (currentPosition: Position) => {
              this.manual = true;
              this.localStorageData.setManual(true);
              this.scannerMsg = 'Ingrese el código QR para acceder.';
            })
            .catch((err: any) => {
              console.log(err);
              if (err.message == 'Illegal Access') {
                this.notification.showMessage('ERROR: Se requiere acceso a la Localización');
              }
              else {
                this.notification.showMessage('Error al obtener la localización');
              }
            });
          })
          .catch( (error) => {
            console.log(error);
            this.notification.showMessage('Error: ocurrió una falla con la localización');
          });
      });
    } else {
      this.manual = true;
      this.localStorageData.setManual(true);
      this.scannerMsg = 'Ingrese el código QR para acceder.';
    }

  }

  cancelManual() {
    this.qrCode = null;
    this.manual = false;
    this.scannerMsg = 'Escanee el código QR para acceder.';
  }

  acceptManual() {
    console.log('Código QR: ', this.qrCode?.toLocaleUpperCase());
    this.sector = this.sectores.find((s) => s.codigoQR != null && s.codigoQR.toLocaleUpperCase() === this.qrCode?.toLocaleUpperCase());
    if (this.sector !== undefined) {
      this.scannerImg = 'assets/icon/scan-check.png';
      this.scannerMsg = 'El código se escaneó con éxito.';
      this.manual = false;
      this.scannedOk = true;
    } else {
      this.notification.showMessage('Código QR invalido.');
    }
  }

  inspeccionarV2() {
    if (this.sector.tareas.length === 0) {
      this.notification.showMessage('No hay tareas para este sector.');

      let sectores = this.localStorageData.getSectores();

      this.sectores.forEach( (sector) => {
        if(this.sector.id == sector.id) {
          sector.status = SECTOR_STATUS.OK;
        }
      })

      this.localStorageData.saveSectores(sectores);
      this.navCtrl.pop();

    } else if (this.sector.tareas.length > 0) {
      this.navCtrl.navigateForward('/supervision/inspeccion-listado', {
        queryParams: {
          data: JSON.stringify({
            inspectionPoints: this.sector.tareas,
            sector: this.sector
          })
        }
      });

    } else {
      this.notification.showMessage('Error recuperando tareas.');
      this.navCtrl.pop();
    }
  }
}
