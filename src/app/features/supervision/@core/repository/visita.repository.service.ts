import { Injectable } from '@angular/core';
import { NetworkService, NotificationService } from 'src/app/@core/services';
import { VisitaService } from '../services/visita.service';
import { LocalizacionSectorTareaLog, SectorVisita, VisitaRutina } from '../models/visita.model';
import { SECTOR_STATUS } from '../models/enums/sector-status.enum';
import moment from 'moment';
import { RutinaService } from '../services/rutina.service';
import { LocalStorageData } from '../local-storage.data';
import { FilesManagmentService } from 'src/app/features/general/@core/services/file-management.service';
import { RutinaHelper } from './rutina.helper';
import { Sector } from '../models/sector.model';
import { Rutina } from '../models/rutina.model';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VisitaRepository {
	constructor(
    public visitaService: VisitaService,
    public rutinaService: RutinaService,
    public localStorageData: LocalStorageData,
    public networkService: NetworkService,
    public fileManagmentService: FilesManagmentService,
    public notificationService: NotificationService) {
	}

  formatedLocalizacionSectorTareaLog(rutina: any, archivoId: any) {
      let localizacionSectoTareaLog = {
          localizacionId: rutina.localizacionId,
          sectorId: rutina.sectorId,
          tareaId: rutina.tareaId,
          visitaId: rutina.visitaId,
          usuarioId: Number(rutina.usuarioId),
          fechaHoraVisita: rutina.fechaHoraVisita
              .toISOString(),
          fechaHora: rutina.fechaHora,
          comentario: rutina.comentario,
          estadoRutina: rutina.status,
          archivoId: archivoId,
      };
      return localizacionSectoTareaLog;
  }

  deleteSendedRutina(r: VisitaRutina) {
      let visitas = this.localStorageData.getVisitas();
      let indexVisitaToDel = -1;
      visitas.forEach((v: any, index: any) => {
          let indexToDel = v.rutinas.filter(v.rutinas, (ruti: any) => {
            return ruti.id == r.id;
          })
          v.rutinas.splice(indexToDel, 1);
          if (v.rutinas.length < 1) {
              indexVisitaToDel = index;
          }
      });
      if (indexVisitaToDel > -1) {
          visitas.splice(indexVisitaToDel, 1);
      }
      // this.localStorageData.updateVisitas(visitas);
  }

  // TODO: PROBLEMA AL BORRAR LAS VISITAS
  deleteSendedVisita(visita: SectorVisita) {
      let visitas = this.localStorageData.getVisitas();
      visitas = visitas.filter((visit: any) => { return visit.index != visita.index });
      console.log(visita,visitas,"visita.repository deleteSendedVisita BORRO VISITA paso final")
      this.localStorageData.updateVisitas(visitas);
  }

  manejarSinConexion(msg: string) {
      this.notificationService.showMessage(msg);
      this.localStorageData.logError(msg);
  }

  async limpiarRutinas(rutinas: Rutina[], sector: SectorVisita): Promise<LocalizacionSectorTareaLog[]> {
    return new Promise(async (resolve, reject) => {
      var rutinasFormateadas: LocalizacionSectorTareaLog[] = [];

      const estaConectado = this.networkService.online();
      if (!estaConectado) {
          this.manejarSinConexion("No hay conexión a internet al momento de cargar las imágenes de las rutinas.");
          throw new Error("No hay conexión a internet al momento de cargar las imágenes de las rutinas.");
      }

      for (let rutina of rutinas) {
          const estadoValido = rutina.status === SECTOR_STATUS.OK || rutina.status === SECTOR_STATUS.FAIL;

          if(rutina.fileOfflineSended) {
            const fileResult = await Filesystem.readFile({
              path: rutina.fileName,
              directory: Directory.Data,
            });
            try {
              const format = `image/${rutina.fileFormat}`;
              const blobImg = this.fileManagmentService.base64ToBlob(fileResult.data as string, format);
              const fileImg = this.fileManagmentService.blobToFile(blobImg, rutina.fileName);
              const result: any = await lastValueFrom(this.fileManagmentService.uploadHash([fileImg], "VisitaDetalle"));
              rutina.archivoId = result.files[0].archivoId;
              if (estadoValido) {
                rutinasFormateadas.push(RutinaHelper.formatearRutina(rutina));
                if (rutinasFormateadas.length === rutinas.length) {
                  return resolve(rutinasFormateadas);
                }
              }
            } catch (error) {
              console.log(error);
              rutinasFormateadas.push(RutinaHelper.formatearRutina(rutina));
              const sectorNombreCompleto = `${sector.sitioNombre}, ${sector.subSitioNombre} - ${sector.descripcion}`;
              this.localStorageData.logError("Ocurrió un fallo al cargar la imagen de la rutina '" + rutina.descripcion + "' del sector " + sectorNombreCompleto +".");
              this.notificationService.showMessage("Ocurrió un fallo al cargar la imagen de la rutina '" + rutina.descripcion + "' del sector " + sectorNombreCompleto +".");
            }
          }
          else {
            if (estadoValido) {
              rutinasFormateadas.push(RutinaHelper.formatearRutina(rutina));
              if (rutinasFormateadas.length === rutinas.length) {
                resolve(rutinasFormateadas);
              }
            }
          }
      }
      return resolve(rutinasFormateadas);
    })
  }

  getInspectedPointsInSector(rutinasEnCache: Rutina[], sectorId: number): Promise<any> {
      return new Promise((resolve, reject) => {

          const hasFails = this.checkForFails(rutinasEnCache);
          const inspected = this.countInspectedPoints(rutinasEnCache);

          const sectores: Sector[] = this.localStorageData.getSectores();
          const sectorIndex = this.findSectorIndex(sectores, sectorId);

          if (sectorIndex !== -1) {
              this.updateSectorRutinas(sectores, sectorIndex, rutinasEnCache);
              this.localStorageData.saveSectores(sectores);
          }

          resolve({
              inspected: inspected,
              hasFails: hasFails,
          });
      });
  }

  private checkForFails(rutinasEnCache: Rutina[]): boolean {
      return rutinasEnCache.some((rutina) => rutina.status === SECTOR_STATUS.FAIL);
  }

  private countInspectedPoints(rutinasEnCache: Rutina[]): number {
      let count = 0;
      for (const rutina of rutinasEnCache) {
          if (rutina.status === SECTOR_STATUS.OK || rutina.status === SECTOR_STATUS.FAIL) {
              count++;
          }
      }
      return count;
  }

  private findSectorIndex(sectores: Sector[], sectorId: number): number {
      return sectores.findIndex((sector) => sector.id === sectorId);
  }

  private updateSectorRutinas(sectores: Sector[], sectorIndex: number, rutinasEnCache: Rutina[]): void {
      sectores[sectorIndex].rutinas = rutinasEnCache;
  }
  /// ---------------------------------------


  ///
  /// -------------------------
  calculateErrors(saveFailed: boolean = false) {
    const plantFullyInspected = this.isPlantFullyInspected();
    const visitas: SectorVisita[] = this.localStorageData.getVisitas();
    const sectors: Sector[] = this.localStorageData.getSectores();
    const imageCount = this.countImagesWithErrors(sectors);
    const inspectionPointsCount = this.countInspectionPointsWithErrors(sectors);

    return new Promise( async(resolve, reject) => {
      var isOnline = await this.networkService.online();
      if (!isOnline) {
        this.handleNoConnection(plantFullyInspected, visitas);
      }
      // else if (saveFailed) {
      //   this.handleSaveFailed();
      // }
      else {
        this.handleSuccess(imageCount, inspectionPointsCount, plantFullyInspected, visitas, sectors);
      }

      resolve(null);
    });
  }

  private handleNoConnection(plantFullyInspected: boolean, visitas: SectorVisita[]) {
    if (!plantFullyInspected || visitas.length !== 0) {
      this.notificationService.showMessage("Hubo un error de conexión del dispositivo al guardar.", 7000);
    }
    this.localStorageData.logError('Hubo un error de conexión del dispositivo al guardar.');
  }

  private handleSaveFailed() {
    this.notificationService.showMessage("Hubo un error/fallo al guardar las visitas.", 2000);
    this.localStorageData.logError('Hubo un error/fallo al guardar las visitas.');
  }

  private handleSuccess(imageCount: number, inspectionPointsCount: number, plantFullyInspected: boolean, visitas: SectorVisita[], sectors: Sector[]) {
    if (this.hasImagesOrInspectionErrors(imageCount, inspectionPointsCount, visitas)) {
      const message = `Hubo un error al guardar. Tenés ${this.getImageMessage(imageCount)} ${inspectionPointsCount} logs con errores de envío.`;
      if (!plantFullyInspected || visitas.length !== 0) {
        this.notificationService.showMessage(message, 2000);
      }
      this.localStorageData.logError(message);
    } else if (visitas.length === 0) {
      this.notificationService.showMessage("Registros guardados con éxito.", 2000);
      this.localStorageData.logError('Registros guardados con éxito.');
      // this.updateSectoresAndPublishEvent(sectors);
    }
  }

  private hasImagesOrInspectionErrors(imageCount: number, inspectionPointsCount: number, visitas: SectorVisita[]) {
    return imageCount > 0 || (inspectionPointsCount > 0 && visitas.length > 0);
  }

  private getImageMessage(imageCount: number) {
    return imageCount > 0 ? imageCount + ' imágenes y ' : '';
  }

  // private updateSectoresAndPublishEvent(sectors: Sector[]) {
  //   sectors.forEach((sector) => {
  //     sector.status = SECTOR_STATUS.MISSING;
  //     delete sector.rutinas;
  //   });
  //   this.localStorageData.saveSectores(sectors);
  //   // this.events.publish('update-sectores');
  // }

  private countImagesWithErrors(sectors: Sector[]) {
    let count = 0;
    sectors.forEach((sector) => {
      if (sector.rutinas) {
        sector.rutinas.forEach((rutina: Rutina) => {
          if (
            !rutina.fileSended &&
            rutina.imagen !== undefined &&
            rutina.imagen !== null &&
            (rutina.status == SECTOR_STATUS.OK || rutina.status == SECTOR_STATUS.FAIL)
          ) {
            count++;
          }
        });
      }
    });
    return count;
  }

  private countInspectionPointsWithErrors(sectors: Sector[]) {
    let count = 0;
    sectors.forEach((sector) => {
      if (sector.rutinas) {
        sector.rutinas.forEach((rutina: Rutina) => {
          if (!rutina.sended && (rutina.status == SECTOR_STATUS.OK || rutina.status == SECTOR_STATUS.FAIL)) {
            count++;
          }
        });
      }
    });
    return count;
  }

  /// ---------------------

  isPlantFullyInspected() {
    let totalInspectionPoints = this.getTotalInspectionPoints();
    let totalInspectedPoints = this.getTotalInspectedPoints();
    return totalInspectedPoints === totalInspectionPoints;
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
