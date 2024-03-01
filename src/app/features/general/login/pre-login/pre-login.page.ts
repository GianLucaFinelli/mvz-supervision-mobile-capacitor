import {
  Component,
  ElementRef,
  OnInit,
  ViewChild } from '@angular/core';
import {
  CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  IonicModule,
  ModalController } from '@ionic/angular';
import {
  environment } from 'src/environments/environment';
import {
  NotificationService,
  ServerStorageService,
  ThemeSelectorService,
} from 'src/app/@core/services';

@Component({
  selector: 'app-pre-login',
  templateUrl: './pre-login.page.html',
  styleUrls: ['./pre-login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule],
})
export class PreLoginPage implements OnInit {
  public contextForm: FormGroup;
  @ViewChild('content', { read: ElementRef, static: true }) content: ElementRef;
  listEntornos: any[] = [
    { id: 1, descripcion: 'Desarrollo' },
    { id: 2, descripcion: 'Testing' },
    { id: 3, descripcion: 'UAT' },
    { id: 4, descripcion: 'Producción' },
  ];
  entornoSelected: any;
  constructor(
    private modalController: ModalController,
    private notificationService: NotificationService,
    private serverStorageService: ServerStorageService  ) {
    this.createForm();
  }

  ngOnInit() {
    console.log();
  }

  createForm() {
    this.contextForm = new FormGroup({
      fSms: new FormControl(),
      fEnviroment: new FormControl(),
    });
    if (
      this.serverStorageService.getServerInfo() &&
      this.serverStorageService.getServerInfo().url
    ) {
      this.contextForm.controls['fEnviroment'].setValue(
        this.serverStorageService.getServerInfo().enviroment
      );
      this.contextForm.controls['fSms'].setValue(
        this.serverStorageService.getServerInfo().sms
      );
    } else {
      this.contextForm.controls['fEnviroment'].setValue(environment.entorno);
      // this.contextForm.controls['fSms'].setValue(environment.sendSMS);
    }
  }

  closeModal() {
    this.modalController.dismiss();
  }

  change() {
    const entorno = this.contextForm.value.fEnviroment;
    let data = { url: '' };
    if (entorno === 'produccion') {
      data = { url: environment.apiProdBaseUrl };
    }
    if (entorno === 'desarrollo') {
      data = { url: environment.apiDevBaseUrl };
    }
    if (entorno === 'uat') {
      data = { url: environment.apiUATBaseUrl };
    }
    if (entorno === 'testing') {
      data = { url: environment.apiTestBaseUrl };
    }
    if (data.url !== '') {
      this.serverStorageService.setServerInfo({
        url: data.url,
        sms: this.contextForm.value.fSms,
        enviroment: this.contextForm.value.fEnviroment,
      });
    }
    this.notificationService.showAlertMessage(
      'Se aplicaron los cambios realizados.',
      null
    );
    this.closeModal();
  }
}
