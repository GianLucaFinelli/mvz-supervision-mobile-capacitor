import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { IonicModule, ModalController } from "@ionic/angular";
import { MvzMenuButton, MvzSpinner } from "src/app/@core/components";
import { TransporteNotificacionesService } from "../@core/services/transporte-notificaciones.service";
import { NotificationModalComponent } from "./notification-modal/notification-modal.component";
import { BackbuttonExitBaseService } from "src/app/@core/services";

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.page.html',
  styleUrls: ['./notificaciones.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    MvzMenuButton,
    MvzSpinner],
})
export class NotificacionesPage implements OnInit {
  notifications: any[];
  isLoading: boolean;

  constructor(
    private modalController: ModalController,
    private backbuttonExitBase: BackbuttonExitBaseService,
    private transporteNotificacionesService: TransporteNotificacionesService) { }

  ngOnInit() {
    this.transporteNotificacionesService.notificationReceived.subscribe(resp => {
      this.cargarNotificaciones(null);
    });
  }

  ionViewWillEnter() {
    this.cargarNotificaciones(null);
  }

  cargarNotificaciones(refresher: any | null){
    this.isLoading = true;
    this.transporteNotificacionesService.getAll().subscribe(resp => {
      this.notifications = resp.items;
      // this.transporteNotificacionesService.getNotificacionesSinLeerAsync().subscribe(x=>{
      //   this.isLoading = false;
      //   if (refresher) {
      //     refresher.target.complete();
      //   }
      // });
    });
  }

  async openNotificationModal(notification: any) {

    // if (!notification.leido) {
    //   this.transporteNotificacionesService.notificacionLeida(notification);
    // }

    const modal = await this.modalController.create({
      component: NotificationModalComponent,
      componentProps: {
        notification: notification,
      },
    });
    await modal.present();
    await modal.onDidDismiss().then(() => {
      this.cargarNotificaciones(null);
    });
  }


  onBackButtonPress() {
    this.backbuttonExitBase.onBackButtonPress('parent');
  }
}
