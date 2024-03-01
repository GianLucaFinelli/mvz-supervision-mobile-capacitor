import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { AppVersionService, BackbuttonExitBaseService, ThemeSelectorService } from "src/app/@core/services";
import { Browser } from '@capacitor/browser';
import { MvzMenuButton } from "src/app/@core/components";


@Component({
  selector: 'app-acerca-de',
  templateUrl: './acerca-de.page.html',
  styleUrls: ['./acerca-de.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    MvzMenuButton],
})
export class AcercaDePage implements OnInit {

  public versionNumber: string = '';
  public imageLogo: string;
  public imageMovizen: string;
  linkPageMovizen:string = 'https://movizen.com/'
  linkPageCoccolo:string = 'https://tcoccolo.com.ar/'

  constructor(
    private appVersionService: AppVersionService,
    private backbuttonExitBase: BackbuttonExitBaseService,
    private themeSelectorService: ThemeSelectorService) {

    this.appVersionService.getVersionNumber().then((version) => {
      this.versionNumber = version;
    });
    if (this.themeSelectorService.darkModeIsEnabled()) {
      this.imageLogo = '/assets/images/dark/logo.png';
      this.imageMovizen = '/assets/images/dark/logo-movizen.png';
    }
    else{
      this.imageLogo = '/assets/images/light/logo.png';
      this.imageMovizen = '/assets/images/light/logo-movizen.png';
    }
  }
  ngOnInit() {
    console.log();
  }

  navigateTo(url: string) {
      Browser.open({ url: url });
    }

    onBackButtonPress() {
      this.backbuttonExitBase.onBackButtonPress('parent');
    }
}
