import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeSelectorService {

  private IS_DARK_MODE_ENABLED = 'is-dark-mode-enabled';

  constructor(
    @Inject(DOCUMENT) private document: Document
  ) { }

  initialize() {
    const isDarkModeEnabled = this.darkModeIsEnabled();
    this.updateThemeMode(isDarkModeEnabled);
  }

  updateThemeMode(flag: boolean) {
    localStorage.setItem(this.IS_DARK_MODE_ENABLED, flag + '');
    this.document.body.classList.toggle('dark', flag);
  }

  darkModeIsEnabled() {
    const criteria = localStorage.getItem(this.IS_DARK_MODE_ENABLED);
    if (criteria && criteria !== 'undefined') {
      return JSON.parse(criteria);
    } else {
      this.updateThemeMode(true);
      return true;
    }
  }
}
