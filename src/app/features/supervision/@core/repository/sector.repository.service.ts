import { Injectable } from '@angular/core';
import { LoadingService, NetworkService, NotificationService } from 'src/app/@core/services';
import { VisitaService } from '../services/visita.service';
import { RutinaService } from '../services/rutina.service';
import { LocalStorageData } from '../local-storage.data';
import { FilesManagmentService } from 'src/app/features/general/@core/services/file-management.service';
import { SectorService } from '../services/sector.service';
import { SECTOR_STATUS } from '../models/enums/sector-status.enum';
import { Rutina } from '../models/rutina.model';
import { Sector } from '../models/sector.model';
import { LocalizacionSectorTareaLog, NewVisita, SectorVisita } from '../models/visita.model';
import { VisitaHelper } from './visita.helper';
import { VisitaRepository } from './visita.repository.service';
import { catchError, from, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SectorRepository {

  completed: number = 0;
  inspected: number = 0;
  loggedUser: any;
  saving: boolean = false;
  logsLeftToSend: number = 0;
  today = new Date();
  imageTotal: number = 0;
  imagenesUploaded = 0;

	constructor(
    public visitaService: VisitaService,
    public rutinaService: RutinaService,
    public sectorService: SectorService,
    public localStorageData: LocalStorageData,
    public networkService: NetworkService,
    public fileManagmentService: FilesManagmentService,
    public visitaRepository: VisitaRepository,
    public notificationService: NotificationService,
    private loadingService: LoadingService,) {
      // this.events.subscribe('connected', () => {
        // let leftToSend = this.localStorageData.getLogsLeftToSend();
        // if (leftToSend) {
        //   if (leftToSend.length > 0) {
        //     this
        //       .saveInspections(leftToSend)
        //       .then(() => {
        //         leftToSend = this.localStorageData.getLogsLeftToSend();
        //         leftToSend = leftToSend.filter((lts: any) => {
        //           return lts.sended && lts.fileSended;
        //         });
        //         this.localStorageData.saveLogsLeftToSend(leftToSend);
        //       })
        //       .catch(() => {
        //         leftToSend = this.localStorageData.getLogsLeftToSend();
        //         leftToSend = leftToSend.filter((lts: any) => {
        //           return lts.sended && lts.fileSended;
        //         });
        //         this.localStorageData.saveLogsLeftToSend(leftToSend);
        //       });
        //   }
        // }
        // // that.savePlantSyncTimes();
        // if (this.allSectorsAreInspected()) {
        //   if (!this.saving) {
        //     this.saving = true;
        //     // this.events.publish('autosyncing-on');
        //     this
        //       .saveLogs()
        //       .then(() => {
        //         this.saving = false;
        //         this.visitaRepository.calculateErrors().then(() => {
        //           // this.notificationService.stopLoading();
        //         });
        //       })
        //       .catch(() => {
        //         this.saving = false;
        //         this.visitaRepository.calculateErrors().then(() => {
        //           // this.notification.stopLoading();
        //         });
        //       });
        //   }
        // }
      // });
	}

  CargarSectores() {
    return new Promise((resolve, reject) => {
        this.sectorService.QrsInspeccion().subscribe({
          next: (result: any) => {
            result.forEach((sector: any) => {
              sector.status = SECTOR_STATUS.MISSING;
              sector.tareas.forEach((t: any) => {
                t.status = SECTOR_STATUS.MISSING;
              });
            });
            this.localStorageData.saveSectores([]);
            this.localStorageData.saveSectores(result);
            resolve(null);

          },
          error: (error: any) => {
            reject(error);
          }
        });
    })
  }


  getSavingState() {
    return this.saving;
  }

  setSavingState(newState: boolean) {
    this.saving = newState;
  }


  isPlantFullyInspected() {
    let totalInspectionPoints = this.getTotalInspectionPoints();
    let totalInspectedPoints = this.getTotalInspectedPoints();
    return totalInspectedPoints === totalInspectionPoints;
  }

  saveLogs() {
    this.setSavingState(true);
    let promises_array = [];
    let that = this;
    let visitas: SectorVisita[] = this.localStorageData.getVisitas();
    if (visitas) {
      visitas.forEach((visita: SectorVisita) => {
        promises_array.push(
          new Promise((resolve, reject) => {
            if (visita.rutinas) {
              // that.saveInspections(visita.rutinas, visita)
              //   .then(() => {
              //     console.log("saveInspections, visita finalizado de subirse");
              //     resolve(null);
              //   })
              //   .catch((error) => {
              //     that.loadingService.hide();
              //     reject(error);
              //   });
              that.saveInspections(visita.rutinas, visita)
              .subscribe({
                next: () => {
                  console.log("saveInspections, visita finalizado de subirse");
                  resolve(null);
                },
                error: (error) => {
                    // that.loadingService.hide();
                    console.log( error,"saveInspections, FAllo")
                    reject(error);
                }
              });

            } else {
              // that.loadingService.hide();
              reject();
            }
          })
        );
      });
    } else {
      // that.loadingService.hide();
      promises_array.push(
        new Promise((resolve, reject) => {
          reject();
        })
      );
    }

    return Promise.all(promises_array);
  }

  saveInspections(rutinas: any[], visita: SectorVisita) {
    return from(this.visitaRepository.limpiarRutinas(rutinas, visita)).pipe(
       switchMap((result: any) => {
         let newVisita: NewVisita = VisitaHelper.FormattedNewVisita(rutinas, result, visita);
         // se envia al server la visita
         return this.visitaService.update(newVisita).pipe(
            tap(() => {
              console.log(newVisita, "sector.repository VISITA UPDATE OK");
              this.ActualizarSectorVisita(visita, true);
            }),
            catchError((err: any) => {
              console.log(err, "sector.repository VISITA UPDATE ERROR");
              let messageSector = `${visita.sitioNombre}, ${visita.subSitioNombre} - ${visita.descripcion}`;
              let mensajeError = `Ocurrio un error al guardar la visita al sector. ${messageSector}.`;
              this.localStorageData.logError(mensajeError);
              // this.loadingService.hide();
              throw err; // Lanza el error para que pueda ser capturado por el operador catchError
            })
         );
       }),
       catchError((error) => {
          this.localStorageData.logError(error);
          console.log("Error al limpiar rutinas");
          throw error; // Propagar el error para que pueda ser manejado por el suscriptor
       })
    );
   }

  async ActualizarSectorVisita(sector: any, sended: boolean = false) {
    if (await this.networkService.online() == false) {
      this.notificationService.showMessage("Ocurrio un error al refrescar las visitas enviadas.");
      this.localStorageData.logError("Ocurrio un error al refrescar las visitas enviadas.");
    }
    else {
      console.log("sector.repository ActualizarSectorVisita BORRO VISITA paso inicial")
      sector.sended = sended;
      if (sector.sended) {
        this.visitaRepository.deleteSendedVisita(sector);
      }
    }
  }

  allSectorsAreInspected() {
    let areInspected: boolean = false;
    let sectors: Sector[] = this.localStorageData.getSectores();
    sectors.forEach((sector: any) => {
      if (sector.rutinas) {
        let rutinasInspected = sector.rutinas.filter((r: any) => r.status == SECTOR_STATUS.OK || r.status == SECTOR_STATUS.FAIL);
        areInspected = rutinasInspected.length == sector.rutinas.length;
      }
    });
    return areInspected;
  }

  getTotalUploadImages() {
    let total = 0;
    let sectors: Sector[] = this.localStorageData.getSectores();
    sectors.forEach((sector) => {
      if (sector.rutinas) {
        total += sector.rutinas.filter(
          (r) =>
            typeof r.imagen == 'object' &&
            r.imagen != null &&
            typeof r.imagen.path === 'string' &&
            (r.status == SECTOR_STATUS.OK || r.status == SECTOR_STATUS.FAIL)
        ).length;
      }
    });
    return total;
  }

  getTotalInspectionPoints() {
    let total = 0;
    let sectors: Sector[] = this.localStorageData.getSectores();
    sectors.forEach((sector) => {
      if (sector.rutinas) {
        total += sector.rutinas.length;
      }
    });
    return total;
  }

  getTotalInspectedPoints() {
    let inspected = 0;
    let sectors: Sector[] = this.localStorageData.getSectores();
    sectors.forEach((sector) => {
      if (sector.rutinas) {
        inspected += sector.rutinas.filter((r) => r.sended).length;
      }
    });
    return inspected;
  }
}
