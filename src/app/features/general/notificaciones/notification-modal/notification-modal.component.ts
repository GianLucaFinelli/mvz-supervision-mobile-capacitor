import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IonicModule, ModalController, NavParams } from '@ionic/angular';
import { TransporteNotificacionesService } from '../../@core/services/transporte-notificaciones.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-notification-modal',
  templateUrl: './notification-modal.component.html',
  styleUrls: ['./notification-modal.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class NotificationModalComponent implements OnInit {
  @Input() notification: any;

  constructor(
    private modalController: ModalController,
    private transporteNotificacionesService: TransporteNotificacionesService,
    private location: Location,
  ) {}

  ngOnInit() {
   
  }

  async closeModal() {
    await this.modalController.dismiss();
  }

  onBackButtonPress() {
    this.location.back()
  }
}
