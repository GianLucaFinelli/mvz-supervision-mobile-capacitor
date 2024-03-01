import { NgForOf, NgIf } from "@angular/common";
import { ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { TransporteNotificacionesService } from "src/app/features/general/@core/services/transporte-notificaciones.service";
import { MensajeSinLeerNotificationServiceService } from "../../services/mensaje-sin-leer-notification-service.service";


@Component({
    selector: 'app-mvz-menu-button',
    templateUrl: './mvz-menu-button.component.html',
    styleUrls: ['./mvz-menu-button.component.scss'],
    standalone: true,
    imports: [IonicModule, NgIf],
  })
  // eslint-disable-next-line @angular-eslint/component-class-suffix
  export class MvzMenuButton implements OnInit {
    sinLeer: number = 0;

    constructor(private mensajeSinLeerNotificationServiceService:MensajeSinLeerNotificationServiceService) {

    }

    ngOnInit() {
      this.mensajeSinLeerNotificationServiceService.changeMessage.subscribe((resp:any) => {
        setTimeout(() => {
          this.sinLeer = resp;
        }, 10);

      });
    }
  }
