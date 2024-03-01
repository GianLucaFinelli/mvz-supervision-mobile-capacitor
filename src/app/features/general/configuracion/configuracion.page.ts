import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonToggle, IonicModule } from '@ionic/angular';
import {
  BackbuttonExitBaseService,
  ThemeSelectorService,
} from 'src/app/@core/services';
import { MvzMenuButton } from 'src/app/@core/components/mvz-menu-button/mvz-menu-button.component';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.page.html',
  styleUrls: ['./configuracion.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, MvzMenuButton],
})
export class ConfiguracionPage implements OnInit {
  @ViewChild(IonToggle, { static: true }) themeToggle: IonToggle;
  private toggle: HTMLIonToggleElement;
  private prefersDark: MediaQueryList;
  isDarkmodeEnabled: boolean;

  constructor(
    private themeSelectorService: ThemeSelectorService,
    private backbuttonExitBase: BackbuttonExitBaseService
  ) {}

  ngOnInit() {
    this.toggle = document.querySelector(
      '#themeToggle'
    ) as HTMLIonToggleElement;
    // escucha los cambios de estado del toggle para actualizar el modo
    this.toggle.addEventListener('ionChange', (ev: any) => {
      this.themeSelectorService.updateThemeMode(ev.detail.checked);
    });

    // inicializa el estado del toggle según el modo que esté almacenado en local storage
    const isDarkModeEnabled = this.themeSelectorService.darkModeIsEnabled();
    this.isDarkmodeEnabled = isDarkModeEnabled;
    this.toggle.checked = isDarkModeEnabled;

    // detección automática de preferencia de modo del navegador
    this.prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    this.prefersDark.addEventListener('change', (mediaQuery) => {
      this.checkToggle(mediaQuery.matches);
    });
  }

  // Called by the media query to check/uncheck the toggle
  checkToggle(shouldCheck: boolean) {
    this.toggle.checked = shouldCheck;
  }

  onBackButtonPress() {
    this.backbuttonExitBase.onBackButtonPress('parent');
  }
}
