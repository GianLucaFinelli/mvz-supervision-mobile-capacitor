import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IonicModule, MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import {
  LoadingService,
  NotificationService,
  ThemeSelectorService,
} from 'src/app/@core/services';
import { AuthService } from '../@core/services';

@Component({
  selector: 'app-olvide-contrasenia',
  templateUrl: './olvide-contrasenia.page.html',
  styleUrls: ['./olvide-contrasenia.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule],
})
export class OlvideContraseniaPage implements OnInit {
  forgetForm: FormGroup;
  private dni: FormControl;
  public image = '/assets/images/dark/logo.png';
  @ViewChild('content', { read: ElementRef, static: true }) content: ElementRef;
  inputNumber: any;

  constructor(
    private loadingService: LoadingService,
    private router: Router,

    private menuCtrl: MenuController,
    private themeSelectorService: ThemeSelectorService,
    private authService: AuthService,
    private notificationService: NotificationService

  ) { }

  ngOnInit() {
    this.menuCtrl.enable(false);
    this.dni = new FormControl('', [Validators.required]);
    this.forgetForm = new FormGroup({
      dni: this.dni,
    });
  }

  validateDni() {
    return this.dni.valid || this.dni.untouched;
  }

  async onSubmit() {

    const loading = await this.loadingService.show();
 
    this.authService.recuperarPassword(this.dni.value).subscribe((x: any) => {
      loading.dismiss();
       this.notificationService.showAlertMessage('Le hemos enviado una nueva contraseña temporal por SMS.',this.goToLogin.bind(this));
    }, (error)=>{
      loading.dismiss();
      this.notificationService.showMessage(error);
    });
}

goToLogin() {
  this.router.navigateByUrl('/general/login');
}

ionViewWillEnter() {

  this.dni = new FormControl('', [Validators.required]);
    this.forgetForm = new FormGroup({
      dni: this.dni,
    });

  if (this.themeSelectorService.darkModeIsEnabled()) {
    this.image = '/assets/images/dark/logo.png';
    this.content.nativeElement.classList.toggle('bg-dark', true);
    this.content.nativeElement.classList.toggle('bg-light', false);
  } else {
    this.image = '/assets/images/light/logo.png';
    this.content.nativeElement.classList.toggle('bg-dark', false);
    this.content.nativeElement.classList.toggle('bg-light', true);
  }
}

onInputChanged(event: any) {
  const maxDigits = 8; 
  let inputValue = event.target.value;
  let numericValue = inputValue.replace(/[^0-9]/g, '');
  this.inputNumber = numericValue.slice(0, maxDigits);
}
}
