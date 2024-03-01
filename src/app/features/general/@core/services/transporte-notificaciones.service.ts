import { EventEmitter, Injectable, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/@core/services';
import { AuthService } from './auth.service';
import { MensajeSinLeerNotificationServiceService } from 'src/app/@core/services/mensaje-sin-leer-notification-service.service';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TransporteNotificacionesService extends ApiService<any> {
  @Output() notificationReceived: EventEmitter<any> = new EventEmitter();
  @Output() notificationActionPerformed: EventEmitter<any> = new EventEmitter();


	constructor(
    http: HttpClient,
    router: Router,
    private authService: AuthService,
    private mensajeSinLeerNotificationServiceService:MensajeSinLeerNotificationServiceService ) {
		super(http, 'notificaciones', router);

    // this.notificationReceived.subscribe(resp => {
    //   this.getNotificacionesSinLeer();
    // });
    // this.notificationActionPerformed.subscribe(resp => {
    //   this.getNotificacionesSinLeer();
    //   if(resp.notification.data.path){
    //     this.router.navigateByUrl(resp.notification.data.path);
    //   }
    // });

    // if(this.authService.isAuthAuthorized()){
    //   // pedimos las notificaciones por primera vez
    //  this.getNotificacionesSinLeer();
    // }
	}

  // getNotificacionesSinLeerAsync(){
  //   let that = this;
  //   return that.get('/sin-leer').pipe(tap (result=>{
  //     that.mensajeSinLeerNotificationServiceService.emit(result);
  //   }));
  // }

  // private getNotificacionesSinLeer(){
  //   return this.getNotificacionesSinLeerAsync().subscribe((resp: any) => {
  //   });
  // }

  // notificacionLeida(transportista: any) {
  //   let notificacion = {
  //     notificacionId: transportista.id,
  //     leida: true,
  //   };
  //   return this.post<any>(`/leida`, notificacion).subscribe((resp: any) => {
  //     this.getNotificacionesSinLeer();
  //   });
  // }
}
