import { CommonModule, NgForOf, NgIf } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { IonContent, IonicModule } from '@ionic/angular';
import { ThemeSelectorService } from '../../services';
import { Browser } from '@capacitor/browser';
import { AuthService } from 'src/app/features/general/@core/services';


@Component({
  selector: 'app-left-side-menu',
  templateUrl: './left-side-menu.component.html',
  styleUrls: ['./left-side-menu.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    NgIf,
    NgForOf,
    RouterLink,
    RouterLinkActive,
    CommonModule,
  ],
})
export class LeftSideMenuComponent {
  public image = '/assets/images/dark/logo.png';
  @ViewChild(IonContent) content: IonContent;

  public appPages = [
    {
      title: 'Inicio',
      url: '/supervision/inicio',
      class: 'material-icons restaurant',
    },
    {
      title: 'Logs',
      url: '/supervision/logs',
      icon: 'person',
    },
    {
      title: 'Ayuda y comentarios',
      url: '/supervision/about',
      icon: 'information',
    },
    {
      title: 'Cerrar Sesión',
      url: 'exit',
      icon: 'exit',
      action: true,
    },
  ];

  constructor(
    private themeSelectorService: ThemeSelectorService,
    private navRouter: Router,
    private authService: AuthService,
  ) {}

  ionWillOpen() {
    const isDarkModeEnabled = this.themeSelectorService.darkModeIsEnabled();
    if (isDarkModeEnabled) {
      this.image = '/assets/images/dark/logo.png';
    } else {
      this.image = '/assets/images/light/logo.png';
    }
    if (this.content) {
      this.content.scrollToPoint(0, 0, 0); // Reinicia el scroll del ion-content al abrir el menú
    }

  }

  navigateTo(url: string) {
    if (url === 'exit') {
      this.authService.logout();
      this.navRouter.navigateByUrl('/');
    } else {
      Browser.open({ url: url });
    }
  }
}
