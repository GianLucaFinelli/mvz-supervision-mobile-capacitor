import { CommonModule, registerLocaleData } from '@angular/common';
import {
  Component,
  LOCALE_ID,
  QueryList,
  ViewChildren } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  ActionSheetController,
  AlertController,
  IonRouterOutlet,
  IonicModule,
  LoadingController,
  MenuController,
  ModalController,
  Platform } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { HttpClientModule } from '@angular/common/http';
import { AppVersionService, ServerStorageService, ThemeSelectorService } from './@core/services';
import { LeftSideMenuComponent } from './@core/layout/left-side-menu/left-side-menu.component';
import localeEs from '@angular/common/locales/es';
// Importar la configuración regional deseada
registerLocaleData(localeEs, 'es');

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [
    HttpClientModule,
    IonicModule,
    RouterLink,
    RouterLinkActive,
    CommonModule,
    LeftSideMenuComponent,
  ],
  providers: [
    // Especificar la configuración regional
    { provide: LOCALE_ID, useValue: 'es' },
  ],
})
export class AppComponent {
  @ViewChildren(IonRouterOutlet) routerOutlets: QueryList<IonRouterOutlet>;

  constructor(
    private themeSelection: ThemeSelectorService,
    private serverStorageService: ServerStorageService,
    // private firebaseNotificationService: FirebaseNotificationService,
    private platform: Platform,
    private actionSheetCtrl: ActionSheetController,
    private modalCtrl: ModalController,
    private menuCtrl: MenuController,
    private loading: LoadingController,
    private alertCtrl: AlertController,
    private appVersionService:AppVersionService
  ) {
    // this.firebaseNotificationService.initializeFirebase();
    // this.backgroundGeolocationService.initializeBackgroundGeolocation();
    this.initializeEnviroment();

    // Comprueba si la aplicación se ha iniciado anteriormente
    const hasStartedBefore = localStorage.getItem('hasStartedBefore');

    // Si la aplicación se ha iniciado anteriormente, no cambies el tema
    if (!hasStartedBefore) {
      // inicializa la app en modo dark por defecto
      this.themeSelection.updateThemeMode(true);

      // Marca que la aplicación se ha iniciado antes
      localStorage.setItem('hasStartedBefore', 'true');
    }

    // inicializa la app en el modo almacenado en local storage (dark/light)
    this.themeSelection.initialize();
    this.appVersionService.checkVersion();
  }

  initializeEnviroment() {
    let serveConfig = this.serverStorageService.getServerInfo();
    console.log(serveConfig);
    if (!serveConfig) {
      this.serverStorageService.setServerInfo({
        url: environment.apiTestBaseUrl,
        // sms: environment.sendSMS,
        enviroment: environment.entorno,
      });
    }
    this.registerHardwareBackButton();
  }

  registerHardwareBackButton() {
    this.platform.backButton.subscribe((e) => {
      e.register(999, async () => {
        // first close any alets, modal etc.
        const pickers: any = document.getElementsByTagName('ion-picker');
        if (pickers.length === 1) {
          pickers[0].dismiss();
        }
        const selects: any = document.getElementsByTagName('ion-alert');
        if (selects.length === 1) {
          selects[0].dismiss();
        }

        const actionsheet = await this.actionSheetCtrl.getTop();
        if (actionsheet) {
          actionsheet.dismiss();
          return;
        }

        const modal = await this.modalCtrl.getTop();
        if (modal) {
          modal.dismiss();
          return;
        }

        const alert = await this.alertCtrl.getTop();
        if (alert) {
          alert.dismiss();
          return;
        }

        const menu = await this.menuCtrl.getOpen();
        if (menu) {
          menu.close();
          return;
        }

        const loading = await this.loading.getTop();
        if (loading) {
          return;
        }

        const outlet: any = this.routerOutlets.first;
        const activeView = outlet.activated.instance;

        if (activeView.onBackButtonPress) {
          activeView.onBackButtonPress();
        }
      });
    });
  }
}
