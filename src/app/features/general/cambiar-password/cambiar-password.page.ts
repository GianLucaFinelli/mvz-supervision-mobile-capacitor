import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { MvzMenuButton } from "src/app/@core/components";
import { BackbuttonExitBaseService, LoadingService, NotificationService } from "src/app/@core/services";
import { CambiarPasswordModel } from "../@core/models";
import { AuthService } from "../@core/services";

@Component({
  selector: 'app-cambiar-password',
  templateUrl: './cambiar-password.page.html',
  styleUrls: ['./cambiar-password.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    MvzMenuButton
  ],
})
export class CambiarpasswordPage {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;

  passwordVisibility: { [key: string]: boolean } = {
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  };

  constructor(
    private loadingService: LoadingService,
    private authService: AuthService,
    private backbuttonExitBase: BackbuttonExitBaseService,
    private notificationService: NotificationService) { }

  async changePassword() {
    const loading = await this.loadingService.show();
    let changePasswordModel = new CambiarPasswordModel();
    changePasswordModel.currentPassword = this.currentPassword;
    changePasswordModel.newPassword = this.newPassword;
    changePasswordModel.newConfirmPassword = this.confirmPassword;

    this.authService.changePassword(changePasswordModel).subscribe(x => {
      loading.dismiss();
      this.currentPassword = '';
      this.newPassword = '';
      this.confirmPassword = '';
      this.notificationService.showMessage('La contraseña ha sido modificada con éxito');
    }, (error) => {
      loading.dismiss();
      this.notificationService.showMessage(error);
    });
  }

  togglePasswordVisibility(field: string) {
    this.passwordVisibility[field] = !this.passwordVisibility[field];
  }

  onBackButtonPress() {
    this.backbuttonExitBase.onBackButtonPress('parent');
  }  
}
