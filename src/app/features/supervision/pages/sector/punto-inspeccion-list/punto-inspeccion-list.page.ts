import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, IonicModule, LoadingController, ModalController, NavController, NavParams, Platform } from '@ionic/angular';
import { MvzMenuButton } from 'src/app/@core/components';
import { LocalStorageData } from '../../../@core/local-storage.data';
import { VisitaRepository } from '../../../@core/repository/visita.repository.service';
import { SectorRepository } from '../../../@core/repository/sector.repository.service';
import { LoadingService, NetworkService, NotificationService } from 'src/app/@core/services';
import { RutinaService } from '../../../@core/services/rutina.service';
import { Rutina } from '../../../@core/models/rutina.model';
import { VisitaService } from '../../../@core/services/visita.service';
import { SECTOR_STATUS } from '../../../@core/models/enums/sector-status.enum';
import { Sector } from '../../../@core/models/sector.model';
import { Tarea } from '../../../@core/models/tarea.model';
import { PuntoInspeccionEditPage } from '../punto-inspeccion-edit/punto-inspeccion-edit.page';

import { Geolocation, Position } from '@capacitor/geolocation';

@Component({
  selector: 'app-punto-inspeccion-list',
  templateUrl: './punto-inspeccion-list.page.html',
  styleUrls: ['./punto-inspeccion-list.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, MvzMenuButton],
  providers: [NavParams],
})
export class PuntoInspeccionListPage implements OnInit {

  inspectionPoints: any[] = [];
  inspected: number = 0;
  sector: Sector;
  isenabled: boolean = false;
  config: any = {};
  emptyInspectionPoints: any[] = [];
  firstLoad: boolean = true;
  hasFails: boolean = false;
  public customMode: string = '';
  // manual: boolean = false;
  loggedUser: any;

  constructor(
    private route: ActivatedRoute,
    private navRouter: Router,
    private navCtrl: NavController,
    public navParams: NavParams,
    public localStorageData: LocalStorageData,
    private visitaRepository: VisitaRepository,
    private sectorRepository: SectorRepository,
    private notification: NotificationService,
    private alertController: AlertController,
    private modalController: ModalController,
    private networkService: NetworkService,
    private platform: Platform,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private rutinaService: RutinaService,
    private visitaService: VisitaService,
    private loadingService: LoadingService,
    private cdr: ChangeDetectorRef
    ) { }

  ngOnInit() {
    if (Object.keys(this.route.queryParams).length === 0) {

    } else {
      this.route.queryParams.subscribe(params => {
        if (params && params['data']) {
          const data = JSON.parse(params['data']);
          console.log(data);
          // Aquí puedes trabajar con el objeto recibido en la página de destino
          this.sector = data.sector;
          this.inspectionPoints = data.inspectionPoints;
          this.emptyInspectionPoints = JSON.parse(JSON.stringify(data.inspectionPoints));
        }
      });
      // this.manual = this.navParams.data.manual;
    }
    this.loggedUser = this.localStorageData.getUsuarioLogueado();
  }


  ionViewWillEnter() {
    console.log('ionViewWillEnter: entro')
    this.hasFails = false;
    this.visitaRepository.getInspectedPointsInSector(this.inspectionPoints, this.sector.id).then((results) => {
      this.inspected = results.inspected;
      this.hasFails = results.hasFails;
      this.isenabled = this.inspected === this.inspectionPoints.length;
    });
  }

  async goBack() {
    const alert = await this.alertController.create({
      header: '¿Salir?',
      message: 'Sus cambios se perderan. ¿Esta seguro/a que quiere salir?',
      cssClass: 'alert-default',
      buttons: [
        {
          text: 'Si',
          handler: () => {
            // let sectores: any = this.localStorageData.getSectores();
            // // delete this.sector.rutinas;

            // let sectorSelected = sectores.find((sector: any) => sector.id == this.sector.id);
            // sectorSelected.rutinas = this.emptyInspectionPoints;
            // this.localStorageData.saveSectores(sectores);
            this.navRouter.navigateByUrl('/supervision/inicio');
          },
        },
        {
          text: 'No',
          handler: () => {
          },
        },
      ],
      translucent: true,
    });
    await alert.present();
  }

  async getCurrentPosition() {
    const coordinates = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 30000,
      maximumAge: 30000
    });
    return coordinates;
  };

  async GpsCheckPermissions() {
    const permissions = await Geolocation.checkPermissions();
    console.log('permissions:', permissions);

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

  confirm() {
    let manual: boolean = this.localStorageData.getManual();
    if (this.sector.useGps || manual) {
      if (this.platform.is('cordova')) {
        this.GpsCheckPermissions().then((hasPermission) => {
          this.getCurrentPosition().then( (currentPosition: Position) => {
            this.inspectionPoints.forEach((rutina: Rutina) => {
              rutina.lat = currentPosition.coords.latitude;
              rutina.long = currentPosition.coords.longitude;
            });
            this.save();
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
      } else {
        //this.notification.displayToast('La funcionalidad no es compatible con tu dispositivo');
        // DEV
         this.inspectionPoints.forEach((rutina: any) => {
           rutina.lat = -32.9633344;
           rutina.long = -60.6345115;
         });
         this.save();
      }

    } else {
      this.save();
    }
    this.cdr.detectChanges();
  }

  async save() {
    let that = this;
    let sectores: any = this.localStorageData.getSectores();

    let sectorSelected = sectores.find((sector: any) => sector.id == this.sector.id);
    sectorSelected.status = this.hasFails ? SECTOR_STATUS.FAIL : SECTOR_STATUS.OK;
    sectorSelected.rutinas = this.inspectionPoints;

    if (that.sector.useServerDatetime) {
      if (await that.networkService.online()) {
        that.visitaService.ServerDatetime().subscribe({
          next: (res) => {
            // loading.dismiss();
            let datetime = new Date()
            sectorSelected.rutinas.forEach((rutina: any) => {
              rutina.fechaHoraVisita = datetime.toUTCString();
              rutina.fechaHora = datetime.toUTCString();
            });

            that.localStorageData.saveVisita(sectorSelected);
            console.log(that.localStorageData.getVisitas());
            sectorSelected.rutinas = that.emptyInspectionPoints;
            that.localStorageData.saveSectores(sectores);
            that.navCtrl.navigateBack('/supervision/inicio');
          },
          error: (error: any) => {
            that.notification.showMessage("Error recuperando hora del servidor.");
          }
        })
      } else {
        that.notification.showMessage("Necesita conexión a Internet para guardar.");
      }

    } else {
      let tmpFechaHora = new Date();
      sectorSelected.rutinas.forEach((rutina: Rutina) => {
        rutina.fechaHoraVisita = tmpFechaHora.toUTCString();
      });

      that.localStorageData.saveVisita(sectorSelected);
      sectorSelected.rutinas = that.emptyInspectionPoints;
      that.localStorageData.saveSectores(sectores);
      that.navCtrl.navigateBack('/supervision/inicio');

    }

  }

  async inspect(item: Tarea) {
    let that = this;
    const modal = await this.modalController.create({
      component: PuntoInspeccionEditPage,
      componentProps: {
        inspectionPoint: item,
        sector: that.sector
      },
    });

    modal.onDidDismiss().then((data) => {
      // Manejar el resultado cuando el componente hijo se cierra
      if (data && data.data) {
        // Realizar acciones necesarias con los datos recibidos
        that.inspectionPoints.forEach((iPoint) => {
          if(iPoint.id == data.data.inspectionPoint.id) {
            iPoint = data.data.inspectionPoint;
          }
        });
        that.visitaRepository.getInspectedPointsInSector(that.inspectionPoints, that.sector.id).then((results) => {
          that.inspected = results.inspected;
          that.hasFails = results.hasFails;
          that.isenabled = that.inspected === that.inspectionPoints.length;
          that.cdr.detectChanges();
        });
      }
    });

    return await modal.present();
  }
}
