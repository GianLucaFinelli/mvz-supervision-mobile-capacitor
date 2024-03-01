import { NgFor, NgIf } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Camera, CameraResultType } from '@capacitor/camera';
import { IonicModule } from '@ionic/angular';
import { LoadingService } from 'src/app/@core/services';
import { GoogleCloudVisionService, LABEL_DETECTION_RESPONSE } from 'src/app/@core/services/google-vision.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'foto-dni',
  templateUrl: './foto-dni.component.html',
  styleUrls: ['./foto-dni.component.scss'],
  standalone: true,
  imports: [IonicModule, NgIf, NgFor, HttpClientModule],
  providers: [GoogleCloudVisionService]
})
export class FotoDniComponent {
  @Input() validateLabel: string = ''; // 'Identity document'
  @Input() imagePhoto: string | undefined;
  @Output() imagePhotoChange = new EventEmitter<string | undefined>();
  @Input() isValid: boolean = false;
  @Output() isValidChange = new EventEmitter<boolean>();
  @Input() imgDefault: string | undefined;
  public imageFormat: string | undefined;
  showErr: boolean = false;

  constructor(private gcvs: GoogleCloudVisionService, private loadingService: LoadingService) {

  }

  takePicture = async () => {
    this.changeImage();
    const image = await Camera.getPhoto({
      quality: 95,
      allowEditing: false,
      width: 600,
      resultType: CameraResultType.Base64,
      promptLabelHeader: "Subir foto",
      promptLabelCancel: "Cancelar",
      promptLabelPhoto: "Galería",
      promptLabelPicture: "Tomar foto con cámara",
    });

    if(this.validateLabel){
       // Solo validamos en producción
       if (environment.production){
        this.detectLabels(image);
      }
      else{
        this.isValid = true;
      }

    }
    this.imageFormat = image.format;
    this.imagePhotoChange.emit("data:image/"+image.format+";base64,"+image.base64String);
    this.isValidChange.emit(this.isValid);
  };

  async detectLabels(image: any){
    const loading = await this.loadingService.show();
    this.isValid = false;
    this.gcvs.getLabels(image.base64String).subscribe((response: LABEL_DETECTION_RESPONSE) => {
      console.log(response);
      this.isValid = response.responses[0].labelAnnotations.findIndex(x => x.description === this.validateLabel && x.score > 0.75) > -1;
      this.isValid ? this.showErr = false : this.showErr = true;
      loading.dismiss();
      this.isValidChange.emit(this.isValid);
    }, err => {
      this.showErr = true;
      loading.dismiss();
      this.isValidChange.emit(this.isValid);
    });
  }

  changeImage(){
    this.imagePhotoChange.emit(undefined);
    this.showErr = false;
  }
}

