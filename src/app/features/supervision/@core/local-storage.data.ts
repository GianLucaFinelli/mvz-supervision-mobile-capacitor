import { Injectable } from '@angular/core';
import moment from 'moment';
import { Sector } from './models/sector.model';


@Injectable({
  providedIn: 'root'
})
export class LocalStorageData {

  constructor() { }

  getAuthToken(): any {
    if (localStorage.getItem('auth-token')) {
      var item = JSON.parse(localStorage.getItem('auth-token') as string);
      if (item && !item.server) {
        item.server = '';
      }
      if (item && !item.url) {
        item.url = '';
      }
      return item;
    } else {
      return null;
    }
  }
  getLastLoggedUser(): any {
    if (localStorage.getItem('lastLoggedUser')) {
      return JSON.parse(localStorage.getItem('lastLoggedUser') as string);
    } else {
      return null;
    }
  }

  getGeneralUrl(): any {
    if (localStorage.getItem('generalUrl')) {
      return JSON.parse(localStorage.getItem('generalUrl') as string);
    } else {
      return null;
    }
  }

  setGeneralUrl(element: any) {
    localStorage.setItem('generalUrl', JSON.stringify(element));
  }

  getSupervisionUrl(): any {
    if (localStorage.getItem('supervisionUrl')) {
      return JSON.parse(localStorage.getItem('supervisionUrl') as string);
    } else {
      return null;
    }
  }

  setSupervisionUrl(element: any) {
    localStorage.setItem('supervisionUrl', JSON.stringify(element));
  }

  getTestingMode(): any {
    if (localStorage.getItem('appMode')) {
      return JSON.parse(localStorage.getItem('appMode') as string);
    } else {
      return null;
    }
  }

  setTestingMode(element: boolean) {
    localStorage.setItem('appMode', JSON.stringify(element));
  }

  setCustomMode(element: string) {
    localStorage.setItem('appCustomMode', JSON.stringify(element));
  }

  getCustomMode(): any {
    if (localStorage.getItem('appCustomMode')) {
      return JSON.parse(localStorage.getItem('appCustomMode') as string);
    } else {
      return '';
    }
  }

  getLastSyncDate(): any {
    if (localStorage.getItem('lastSyncDate')) {
      return localStorage.getItem('lastSyncDate');
    } else {
      return null;
    }
  }

  getAppVersion(): any {
    if (localStorage.getItem('appVersion')) {
      return JSON.parse(localStorage.getItem('appVersion') as string);
    } else {
      return null;
    }
  }

  getAndroidVersionCode(): any {
    if (localStorage.getItem('androidVersionCode')) {
      return JSON.parse(localStorage.getItem('androidVersionCode') as string);
    } else {
      return null;
    }
  }

  getFilesToDownload() {
    if (localStorage.getItem('filesToDownload')) {
      return JSON.parse(localStorage.getItem('filesToDownload') as string);
    } else {
      return null;
    }
  }

  getPlantSyncTimes() {
    if (localStorage.getItem('plantSyncTimes')) {
      return JSON.parse(localStorage.getItem('plantSyncTimes') as string);
    } else {
      return null;
    }
  }

  getLoggerRegisters() {
    if (localStorage.getItem('logRegisters')) {
      return JSON.parse(localStorage.getItem('logRegisters') as string);
    } else {
      return null;
    }
  }

  getUsuarioLogueado() {
    if (localStorage.getItem('usuario-logueado')) {
      return JSON.parse(localStorage.getItem('usuario-logueado') as string);
    } else {
      return null;
    }
  }

  setUsuarioLogueado(value: any) {
    localStorage.setItem('usuario-logueado', JSON.stringify(value));
  }

  removeUsuarioLogueado() {
    localStorage.removeItem('usuario-logueado');
  }

  setAuthToken(element: any) {
    localStorage.setItem('auth-token', JSON.stringify(element));
    let date = new Date();
    if(element === null || element.token === null) this.setActiveSession(false, null);
    else this.setActiveSession(true, date);
  }

  setLastLoggedUser(element: any) {
    localStorage.setItem('lastLoggedUser', JSON.stringify(element));
  }

  setLastSyncDate(element: any) {
    localStorage.setItem('lastSyncDate', element);
  }

  setAppVersion(element: any) {
    localStorage.setItem('appVersion', JSON.stringify(element));
  }

  setAndroidVersionCode(element: any) {
    localStorage.setItem('androidVersionCode', JSON.stringify(element));
  }

  setFilesToDownload(element: any) {
    localStorage.setItem('filesToDownload', JSON.stringify(element));
  }

  setPlantSyncTimes(element: any) {
    localStorage.setItem('plantSyncTimes', JSON.stringify(element));
  }

  setLoggerRegisters(element: any) {
    localStorage.setItem('logRegisters', JSON.stringify(element));
  }

  setManual(manual: boolean){
    localStorage.setItem('codeManual', JSON.stringify(manual));
  }

  getManual(){
    if (localStorage.getItem('codeManual')) {
      return JSON.parse(localStorage.getItem('codeManual') as string) as boolean;
    } else {
      return false;
    }
  }

  getVisitas(): any {
    if (localStorage.getItem('visitas')) {
      return JSON.parse(localStorage.getItem('visitas') as string);
    } else {
      return [];
    }
  }

  getSectores(): Sector[] {
    if (localStorage.getItem('sectores')) {
      return JSON.parse(localStorage.getItem('sectores') as string);
    } else {
      return [];
    }
  }

  getRutinas(): Array<any> {
    if (localStorage.getItem('rutinas')) {
      return JSON.parse(localStorage.getItem('rutinas') as string);
    } else {
      return [];
    }
  }

  getEquiposPlanta() {
    if (localStorage.getItem('equiposPlanta')) {
      return JSON.parse(localStorage.getItem('equiposPlanta') as string);
    } else {
      return null;
    }
  }

  getPlantStatus() {
    return JSON.parse(localStorage.getItem('plantStatus') as string);
  }
  getEquipos() {
    if (localStorage.getItem('equipos')) {
      return JSON.parse(localStorage.getItem('equipos') as string);
    } else {
      return null;
    }
  }
  getLogsLeftToSend() {
    if (localStorage.getItem('logsLeftToSend')) {
      return JSON.parse(localStorage.getItem('logsLeftToSend') as string);
    } else {
      return [];
    }
  }
  getImagesToSend() {
    if (localStorage.getItem('imagesToSend')) {
      return JSON.parse(localStorage.getItem('imagesToSend') as string);
    } else {
      return [];
    }
  }
  getRememberedUser() {
    if (localStorage.getItem('rememberedUserDetails')) {
      return JSON.parse(localStorage.getItem('rememberedUserDetails') as string);
    } else {
      return null;
    }
  }

  saveVisita(visita: any) {
    let visitas: any[] = this.getVisitas() ? this.getVisitas() : [];
    var index = this.getIndexVisitas();
    visita.index = index;
    visitas.push(visita);
    localStorage.setItem('visitas', JSON.stringify(visitas));
    this.setIncrementVisitasIndex();
  }

  updateVisitas(v: any) {
    localStorage.setItem('visitas', JSON.stringify(v));
  }

  saveIndexVisitas(index: number) {
    localStorage.setItem('visitaIndex', JSON.stringify(index));
  }

  getIndexVisitas() {
    if(localStorage.getItem('visitaIndex')) {
      let index = localStorage.getItem('visitaIndex') as string;
      return parseInt(index);
    }
    else {
      return 1;
    }
  }

  setIncrementVisitasIndex() {
    let index = this.getIndexVisitas();
    index++;
    this.saveIndexVisitas(index);
  }

  saveSectores(element: any) {
    localStorage.setItem('sectores', JSON.stringify(element));
  }

  savePlantStatus(element: any) {
    localStorage.setItem('plantStatus', JSON.stringify(element));
  }

  // saveLogsLeftToSend(element: any) {
  //   localStorage.setItem('logsLeftToSend', JSON.stringify(element));
  // }
  // saveImagesToSend(el: any) {
  //   localStorage.setItem('imagesToSend', JSON.stringify(el));
  // }
  setRememberedUser(element: any) {
    localStorage.setItem('rememberedUserDetails', JSON.stringify(element));
  }

  getCoords() {
    if (localStorage.getItem('coords')) {
      return JSON.parse(localStorage.getItem('coords') as string);
    } else {
      return null;
    }
  }
  setCoords(element: any) {
    localStorage.setItem('coords', JSON.stringify(element));
  }


  logError(message: any) {
    let logs = this.getLoggerRegisters();
    if (logs) {
      if (logs.length === 60) {
        logs.shift();
      }
    } else {
      logs = [];
    }
    logs.push(moment().format('DD/MM/YYYY HH:mm') + ': ' +message);
    this.setLoggerRegisters(logs);
  }

  setActiveSession(value: boolean, date: Date | null = null) {
    if(date) date = this.addHours(1, date);
    let activeSession = {
      active: value,
      logoutTime: date
    };
    localStorage.setItem('activeSession', JSON.stringify(activeSession));
  }

  getActiveSession(): { active:boolean, logoutTime: Date } {

    if(localStorage.getItem('activeSession')) {
      return  JSON.parse(localStorage.getItem('activeSession') as string);
    }
    return { active: false, logoutTime: new Date };
  }

  addHours(numOfHours: any, date = new Date()) {
    date.setTime(date.getTime() + numOfHours * 60 * 60 * 1000);
    return date;
  }

  getInspectionPoints() {
    if(localStorage.getItem('inspectionPoints')) {
      return JSON.parse(localStorage.getItem('inspectionPoints')as string) as any[];
    }
    return [];
  }

  setInspectionPoints(inspectionPoint: any) {
    if(localStorage.getItem('inspectionPoints')) {
      var inspectionPointsSaveds = JSON.parse(localStorage.getItem('inspectionPoints')as string) as any[];
      if(inspectionPointsSaveds) {
        inspectionPointsSaveds.push(inspectionPoint);
        localStorage.setItem('inspectionPoints', JSON.stringify(inspectionPointsSaveds));
      }
    }
    else {
      localStorage.setItem('inspectionPoints', JSON.stringify([inspectionPoint]));
    }
  }

  restoreInspectionPoints() {
    localStorage.removeItem('inspectionPoints');
  }
}
