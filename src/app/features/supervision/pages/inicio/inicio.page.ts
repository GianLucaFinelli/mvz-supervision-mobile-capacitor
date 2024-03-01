import { VisitaRepository } from './../../@core/repository/visita.repository.service';
import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, IonicModule, IonicSafeString, ModalController } from '@ionic/angular';
import { LocalStorageData } from '../../@core/local-storage.data';
import { LoadingService, NetworkService, NotificationService } from 'src/app/@core/services';
import { VisitaService } from '../../@core/services/visita.service';
import { SectorRepository } from '../../@core/repository/sector.repository.service';
import { Router } from '@angular/router';
import { MvzMenuButton } from 'src/app/@core/components';
import { PuntoInspeccionEditPage } from '../sector/punto-inspeccion-edit/punto-inspeccion-edit.page';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, MvzMenuButton],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class InicioPage implements OnInit {

  lastSyncDate: any;
  public sectors: any = {};
  public visitas: any = {};
  completed: number = 0;
  user: any;
  isenabled: boolean = false;
  // plantStatus: string = '0';
  autosyncing: boolean = false;
  public progressReg: number = 0;
  // public totalReg: number = 0;
  // public totalImages: number = 0;
  public progressImages: number = 0;
  public currentImagen: string = '';
  public currentImagenProgress: number = 0;
  public buttonPressed: boolean = false;
  // public testing: boolean = this.Constantes.testing;
  public customMode: string = '';

  loggedUser: any;

  constructor(
    // public nav: Nav,
    // private menu: MenuController,
    // public events: Events,
    private navRouter: Router,
    private localStorageData: LocalStorageData,
    private visitaRepository: VisitaRepository,
    private sectorRepository: SectorRepository,
    private loadingService: LoadingService,
    private alertController: AlertController,
    // private connection: ConnectionService,
    // private Constantes: Constantes,
    private notification: NotificationService,
    private visitaService: VisitaService,
    private networkService: NetworkService,
    private modalController: ModalController
  ) {
    this.customMode = this.localStorageData.getCustomMode();

    this.sectors = this.localStorageData.getSectores();
    this.visitas = this.localStorageData.getVisitas();

    // this.totalReg = this.visitaRepository.getTotalInspectionPoints();
    // this.plantStatus = this.localStorageData.getPlantStatus();

    this.loggedUser = this.localStorageData.getUsuarioLogueado();
  }

  ngOnInit() {
    console.log();
  }

  ionViewWillEnter() {
    // this.plantStatus = this.localStorageData.getPlantStatus();
    this.completed = 0;
    this.sectors = this.localStorageData.getSectores();
    this.visitas = this.localStorageData.getVisitas();
    this.lastSyncDate = this.localStorageData.getLastSyncDate();
    this.sectorsCompleted();
    this.checkDisabled();
  }

  ionViewDidLoad() { }

  ionViewDidEnter() {
    // this.menu.enable(true);
  }


  updateItem() {
    this.sectors.forEach((sector: any) => (sector.status = 'missing'));
    this.completed = 0;
    // this.localStorageData.savePlantStatus(this.plantStatus);
  }

  // async editItem(sector: any) {
  //   let that = this;
  //   const alert = await this.alertController.create({
  //     header: 'Editar',
  //     message: '¿Esta seguro/a que quiere Editar?',
  //     cssClass: 'alert-default',
  //     buttons: [
  //       {
  //         text: 'Si',
  //         handler: async () => {
  //           const modal = await this.modalController.create({
  //             component: PuntoInspeccionEditPage,
  //             componentProps: {
  //               inspectionPoint: sector.rutinas,
  //               sector: sector
  //             },
  //           });

  //           modal.onDidDismiss().then((data) => {
  //               // Manejar el resultado cuando el componente hijo se cierra
  //               if (data && data.data) {
  //                 // Realizar acciones necesarias con los datos recibidos
  //               }
  //           })
  //         },
  //       },
  //       {
  //         text: 'No',
  //         handler: () => {
  //         },
  //       }
  //     ],
  //     translucent: true,
  //   });
  //   await alert.present();
  // }

  async deleteItem(indexToDel: number) {
    let that = this;
    const alert = await this.alertController.create({
      header: '¿Borrar?',
      message: 'Sus cambios se perderan. ¿Esta seguro/a que quiere BORRAR?',
      cssClass: 'alert-default',
      buttons: [
        {
          text: 'Si',
          handler: () => {
            that.visitas.splice(indexToDel, 1);
            this.localStorageData.updateVisitas(that.visitas);
            this.checkDisabled();
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

  exit() {
    // this.events.publish('logout');
  }

  async cancelInspection() {
    const alert = await this.alertController.create({
      header: 'Cancelar inspección',
      message: '¿Estás seguro de cancelar la inspección?, se borrarán todos los datos de sectores ya inspeccionados.',
      cssClass: 'alert-default',
      buttons: [
        {
          text: 'Sí, estoy seguro',
          handler: () => {
            this.loadingService.show();
            this.completed = 0;
            this.sectors.forEach((sector: any) => {
              sector.status = 'missing';
              delete sector.rutinas;
            });
            this.localStorageData.saveSectores(this.sectors);
            this.loadingService.hide();
          },
        },
        {
          text: 'No, mantener datos',
          handler: () => {
          },
        },
      ],
      translucent: true,
    });
  }

  async confirm() {
    let isSaving = this.sectorRepository.getSavingState();
    if (!isSaving) {
      if (await this.networkService.online()) {
        this.sectorRepository.setSavingState(true);
        this.isenabled = false;
        this.loadingService.show();
        this.sectorRepository
            .saveLogs()
            .then(() => {
              this.sectorRepository.setSavingState(false);
              // CASO 1: Works
              this.visitaRepository.calculateErrors().then(() => {
                this.sectorsCompleted();
                this.loadingService.hide();
                this.checkDisabled();
              });
            })
            .catch(() => {
              this.sectorRepository.setSavingState(false);
              this.sectorsCompleted();
              this.loadingService.hide();
              // CASO 2: home.ts
              this.visitaRepository.calculateErrors(true)
              .then(() => {
                // this.notification.stopLoading();
                this.sectorsCompleted();
                this.loadingService.hide();
                this.checkDisabled();
              })
              .catch(() => {
                // this.notification.stopLoading();
                this.sectorsCompleted();
                this.loadingService.hide();
                this.checkDisabled();
              });
            });
      }  else {
        let that = this;
        console.log("Confirm ===> else sin setSavingState");
        this.sectorRepository.setSavingState(false);
        // CASO 3: home.ts
        this.visitaRepository.calculateErrors().then(() => {
          // this.notification.stopLoading();
          this.loadingService.hide();
          this.sectorsCompleted();
        });
      }
    }
    else {
      this.sectorRepository.setSavingState(false);
    }
  }

  checkDisabled() {
    this.completed = 0;
    this.visitas.forEach((v: any) => {
      if (v.status == 'OK' || v.status == 'FAIL') {
        this.completed++;
      }
    });
    this.isenabled = this.completed > 0 ? true : false;
  }

  sectorsCompleted(): any {
    // cambiar el nombre a esta func
    let output: any[] = [];
    this.visitas = this.localStorageData.getVisitas();
    this.visitas.forEach((s: any) => {
      if (s.status !== 'missing') {
        output.push(s);
      }
    });
    return output;
  }

  goToScan() {
    this.navRouter.navigateByUrl('/supervision/scan-qr');
  }

}
