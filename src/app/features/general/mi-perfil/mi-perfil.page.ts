import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { MvzMenuButton } from "src/app/@core/components";
import { BackbuttonExitBaseService, LoadingService, NotificationService } from "src/app/@core/services";

@Component({
  selector: 'app-mi-perfil',
  templateUrl: './mi-perfil.page.html',
  styleUrls: ['./mi-perfil.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    MvzMenuButton],
})
export class MiPerfilPage implements OnInit {

  constructor(
    // private transportistaService: TransportistaService,
    private notificationService: NotificationService,
    private backbuttonExitBase: BackbuttonExitBaseService,
    private loadingService: LoadingService

  ) { }

  async ngOnInit() {
    console.log();
  }

  async ionViewWillEnter() {
    // const loading = await this.loadingService.show();
    // this.transportistaService.getPerfil().subscribe((transportista: Transportista) => {
    //   this.transportista = transportista;
    //   loading.dismiss();
    // }, (error) => {
    //   loading.dismiss();
    //   this.notificationService.showMessage(error);
    // });
  }

  onBackButtonPress() {
    this.backbuttonExitBase.onBackButtonPress('parent');
  }
}
