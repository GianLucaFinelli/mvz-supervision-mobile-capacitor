import { CommonModule } from '@angular/common';
import {
  Component,
  forwardRef,
  OnInit,
  ViewChild,
  ElementRef,
  HostListener,
} from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  NG_VALUE_ACCESSOR,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

import {
  IonicModule,
  ModalController,
  MenuController,
  IonInput,
} from '@ionic/angular';
import { MvzPasswordEditorComponent } from 'src/app/@core/components/mvz-password-editor/mvz-password-editor.component';
import {
  LoadingService,
  NotificationService,
  AppVersionService,
  NetworkService,
  ThemeSelectorService,
  BackbuttonExitBaseService,
  SessionStorageService,
  ServerStorageService,
} from 'src/app/@core/services';
import { environment } from 'src/environments/environment';
import { AuthService } from '../@core/services';
import { DispositivoService } from '../@core/services/dispositivo.service';
import { PreLoginPage } from './pre-login/pre-login.page';
import { AplicacionService } from '../@core/services/aplicacion.service';
import { CuentaService } from '../@core/services/cuenta.service';
import { SectorRepository } from '../../supervision/@core/repository/sector.repository.service';
import { UsuariosService } from '../@core/services/usuarios.service';
import { forkJoin } from 'rxjs';
import { Usuario } from '../@core/models/usuario.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MvzPasswordEditorComponent,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MvzPasswordEditorComponent),
      multi: true,
    },
  ],
})
export class LoginPage implements OnInit {
  currentBanners: any;
  inputUser: any;
  enviroment: any;
  constructor(
    private authService: AuthService,
    private loadingService: LoadingService,
    private notificationService: NotificationService,
    private appVersionService: AppVersionService,
    private navRouter: Router,
    private fb: FormBuilder,
    private sessionStorageService: SessionStorageService,
    private serverStorageService: ServerStorageService,
    private modalController: ModalController,
    private networkService: NetworkService,
    private menuCtrl: MenuController,
    private themeSelectorService: ThemeSelectorService,
    private backbuttonExitBase: BackbuttonExitBaseService,
    private dispositivoService: DispositivoService,
    private aplicacionService: AplicacionService,
    private sectorRepository: SectorRepository,
    private cuentaService: CuentaService,
    private usuarioService: UsuariosService) {

  }

  public loginForm: FormGroup;
  public versionNumber: string;
  //public counter = 0;
  public image = '/assets/images/dark/logo.png';
  //token = 'vacio';
  //authenticated = new EventEmitter();
  rememberMe = true;
  @ViewChild('content', { read: ElementRef, static: true }) content: ElementRef;
  @ViewChild('inputPass', { static: false }) inputPass: any;
  @ViewChild('inputUserName', { static: false }) inputUsername: IonInput;
  @HostListener('document:keyup', ['$event'])

  handleKeyboardEvents(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      if (window.location.pathname === '/account/login') {
        if (!this.loginForm.value.userName) {
          this.inputUsername.setFocus();
        } else if (!this.loginForm.value.password) {
          this.inputPass.focus();
        } else {
          this.onSubmit(this.loginForm);
        }
      }
    }
  }

  ngOnInit() {
    this.initializeLayout();
  }

  ionViewDidEnter(): void {
    // https://github.com/ionicthemes/ionic6-starter-app/issues/13
    this.menuCtrl.enable(false);
  }

  initializeLayout() {

    this.appVersionService.getVersionNumber().then((version) => {
      this.versionNumber = version;
    });

    const rememberMe = this.sessionStorageService.getRememberMe();

    if (rememberMe) {
      this.loginForm = this.fb.group({
        userName: [rememberMe ? this.sessionStorageService.getLoggedUser() : "", [Validators.required],],
        password: [rememberMe ? this.sessionStorageService.getLoggedPass() : "", [Validators.required],],
        rememberMe: [rememberMe],
      });

    } else {
      this.loginForm = this.fb.group({
        userName: ["", [Validators.required]],
        password: ["", [Validators.required]],
        rememberMe: [rememberMe],
      });
    }
    const isDarkModeEnabled = this.themeSelectorService.darkModeIsEnabled();
    if (isDarkModeEnabled) {
      this.image = '/assets/images/dark/logo.png';
      this.content.nativeElement.classList.toggle('bg-dark', true);
      this.content.nativeElement.classList.toggle('bg-light', false);
    } else {
      this.image = '/assets/images/light/logo.png';
      this.content.nativeElement.classList.toggle('bg-dark', false);
      this.content.nativeElement.classList.toggle('bg-light', true);
    }

    this.setEntorno();
  }

  ionViewWillEnter() {
    this.initializeLayout();
  }

  async onSubmit(loginForm: FormGroup) {
    if (loginForm.valid) {
      if (await this.networkService.validate()) {
        if (this.loginForm.value.userName && this.loginForm.value.password) {
          const loading = await this.loadingService.show();

          if (
            this.loginForm.value.userName === environment.supportUser &&
            this.loginForm.value.password === environment.supportPass
          ) {
            this.openModalPreLogin();
            loading.dismiss();
          } else {
            this.authService.login(this.loginForm.value).subscribe({
              next:(loginResult: any) => {
                if (loginResult) {

                  localStorage.setItem('token', loginResult.token);
                  // Verificar si el usuario tiene el modulo supervision
                  this.aplicacionService.getAplicacionesPermitidas().subscribe((appsResult) => {
                    let appSupervision = appsResult.find(x => x.aplicacionId == environment.aplicacionId);
                    if(!appSupervision) {
                      this.notificationService.showMessage('Acceso no autorizado. Comuníquese con sus superiores para solicitar los permisos necesarios.');
                      loading.dismiss();
                      this.navRouter.navigateByUrl('/general/login');
                      return;
                    }
                  });

                  // Obtenemos el nombre de usuario
                  this.usuarioService.MiPerfil().subscribe((usuario: Usuario) => {
                    localStorage.setItem('usuario-logueado', JSON.stringify({
                      nombre: usuario.nombre,
                      apellido: usuario.apellido,
                      id: usuario.id
                    }));
                  })

                  // cargamos secotres segun las cuentas del usuario
                  this.sectorRepository.CargarSectores().then(() => {
                    this.menuCtrl.enable(true);
                    this.setupRememberInfo();
                    this.notificationService.showMessage('Inicio de sesión exitoso');
                    loading.dismiss();
                    this.navRouter.navigateByUrl('/supervision/inicio');
                  })
                  .catch((error) => {
                    this.notificationService.showMessage('Ocurrio un problema al iniciar sesión.');
                    loading.dismiss();
                    this.navRouter.navigateByUrl('/general/login');
                    return;
                    // catchin error posible
                  });
                }
              },
              error:(error: any) => {
                loading.dismiss();
                this.notificationService.showMessage(error);
              }
            }
            );
          }
        }
      }
    } else {
      this.validateAllFormFields(true);
    }
  }

  setupRememberInfo() {
    this.sessionStorageService.setRememberMe(this.rememberMe);
    this.sessionStorageService.setLoggedUser(this.loginForm.value.userName);
    this.sessionStorageService.setLoggedPass(this.loginForm.value.password);
  }

  validateAllFormFields(value: any) {
    Object.keys(this.loginForm.controls).forEach((field) => {
      const control = this.loginForm.get(field);
      if (control) {
        control.markAsTouched({ onlySelf: value });
        control.markAsDirty({ onlySelf: value });
      }
    });
  }

  goToForgot() {
    this.navRouter.navigateByUrl('/general/olvide-contrasenia');
  }

  goToRegister() {
    this.navRouter.navigateByUrl('/general/registrar-cuenta');
  }

  async openModalPreLogin() {
    const modal = await this.modalController.create({
      component: PreLoginPage,
    });
    modal.onDidDismiss().then(() => {
      this.loginForm.patchValue({ userName: '', password: '' });
      this.setEntorno();
    });
    return await modal.present();
  }

  onBackButtonPress() {
    this.backbuttonExitBase.onBackButtonPress('root');
  }

  setEntorno() {
    let serverInfo = this.serverStorageService.getServerInfo();
    if (serverInfo) {
      this.enviroment = serverInfo.enviroment;
    } else {
      this.enviroment = environment.entorno;
    }
  }
}
