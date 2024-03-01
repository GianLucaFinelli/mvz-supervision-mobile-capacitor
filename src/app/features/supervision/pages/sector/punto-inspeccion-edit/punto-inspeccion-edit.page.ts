import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule, ModalController, NavController, NavParams, Platform } from '@ionic/angular';
import { MvzMenuButton } from 'src/app/@core/components';
import { LocalStorageData } from '../../../@core/local-storage.data';
import { LoadingService, NetworkService, NotificationService } from 'src/app/@core/services';
import { VisitaRepository } from '../../../@core/repository/visita.repository.service';
import { SectorRepository } from '../../../@core/repository/sector.repository.service';
import { Sector } from '../../../@core/models/sector.model';
import { SECTOR_STATUS } from '../../../@core/models/enums/sector-status.enum';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { FilesManagmentService } from 'src/app/features/general/@core/services/file-management.service';

@Component({
  selector: 'app-punto-inspeccion-edit',
  templateUrl: './punto-inspeccion-edit.page.html',
  styleUrls: ['./punto-inspeccion-edit.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, MvzMenuButton],
  providers: [NavParams]
})
export class PuntoInspeccionEditPage implements OnInit {

  inspected: number = 0;
  @Input() inspectionPoint: any;
  isenabled: boolean = false;
  imagen: any = null;
  imageName: string | null = null;
  // pointForm: FormGroup;
  equipoData: any;
  statusOfPoint: string;
  @Input() sector: Sector;
  public customMode: string = '';
  comentario: string = '';
  loggedUser: any;

  constructor(
    public nav: Router,
    private activatedRoute: ActivatedRoute,
    private navCtrl: NavController,
    private navParams: NavParams,
    public localStorageData: LocalStorageData,
    private notification: NotificationService,
    // private formBuilder: FormBuilder,
    private platform: Platform,
    private sectorRepository: SectorRepository,
    private visitaRepository: VisitaRepository,
    private cdr: ChangeDetectorRef,
    private modalController: ModalController,
    public fileManagmentService: FilesManagmentService,
    private loadingService: LoadingService,
    private networkService: NetworkService,
  ) {
    this.customMode = this.localStorageData.getCustomMode();

  }

  ngOnInit() {
    this.inspectionPoint.archivo = null;
    this.inspectionPoint.fileFormat = null;
    this.loggedUser = this.localStorageData.getUsuarioLogueado();
    if (this.inspectionPoint && this.sector) {
      console.log(this.inspectionPoint, this.sector);
      if (this.inspectionPoint.imagen !== null && this.inspectionPoint.imagen !== undefined) {
        this.imageName = this.inspectionPoint.imagen.name;
        this.imagen = this.inspectionPoint.imagen.path;
      }
      this.statusOfPoint = this.inspectionPoint.status;
      let group: any = {};
      let numberRegex = /^-?(\d)+([.,]?(\d)+)?$/;
      group['comentario'] = [
        this.inspectionPoint.comentario ? this.inspectionPoint.comentario : null,
        Validators.compose([Validators.maxLength(45)]),
      ];
      // this.pointForm = this.formBuilder.group(group);
      this.cdr.detectChanges();
    }
    else {
      this.notification.showMessage('No se pudo cargar la rutina. Enviandote al inicio.');
      this.nav.navigateByUrl('/supervision/inicio');
    }
  }

  ionViewWillEnter() {
    this.checkDisabled();
  }

  checkComentario(ev: any) {
    this.comentario = ev.detail.value;
    this.checkDisabled();
  }

  checkDisabled() {
    const statusPoint = (this.statusOfPoint == SECTOR_STATUS.OK || this.statusOfPoint == SECTOR_STATUS.FAIL);
    this.isenabled = statusPoint && this.comentario.length < 45;
  }

  changeStatus(newStatus: string) {
    this.statusOfPoint = newStatus;
    if (newStatus == SECTOR_STATUS.MISSING) {
      // this.pointForm.setValue({ comentario: null });
      this.clearImage();
      this.inspectionPoint.comentario = null;
    }
    this.inspectionPoint.status = newStatus;
    this.cdr.detectChanges();
    this.checkDisabled();
  }

  goBack() {
    this.inspectionPoint.status = SECTOR_STATUS.MISSING;
    this.inspectionPoint.comentario = null;
    this.inspectionPoint.fechaHora = new Date();
    this.inspectionPoint.imagen = null;
    this.modalController.dismiss({
      inspectionPoint: null
    });
  }

  confirm() {
    // let formdata = this.pointForm.getRawValue();
    this.inspectionPoint.comentario = this.comentario;
    if (this.imagen !== undefined && this.imagen !== null) {
      this.inspectionPoint.imagen = {
        name: this.imageName,
        path: this.imagen,
      };
    }
    this.inspectionPoint.status = this.statusOfPoint;
    this.inspectionPoint.tareaId = this.inspectionPoint.id;
    this.inspectionPoint.sectorId = this.sector.id;
    this.inspectionPoint.subSitioId = this.sector.subSitio.id;
    this.inspectionPoint.sitioId = this.sector.subSitio.sitioId;
    this.inspectionPoint.localizacionId = this.sector.subSitio.localizacionId;
    this.inspectionPoint.fechaHora = new Date();
    this.modalController.dismiss({
      inspectionPoint: this.inspectionPoint
    });
    // this.navCtrl.pop();
  }

  clearImage() {
    let imgs = this.localStorageData.getImagesToSend();
    let imgLocalIndex = imgs.findIndex((x: any) => x.id == this.imagen);
    if (imgLocalIndex !== -1) {
      imgs.splice(imgLocalIndex, 1);
      this.imagen = null;
    }

    this.inspectionPoint.imagen = null;
    this.imageName = null;
  }

  async openCamera(gallery: Boolean) {
    if (this.platform.is('cordova')) {
      var source = gallery ? CameraSource.Photos : CameraSource.Camera;
      console.log("ENTRO CAMARA: ")
      try {
        const image = await Camera.getPhoto({
          quality: 40, // Calidad de la imagen (0-100)
          // width: 500, // Ancho de la imagen
          // height: 500, // Altura de la imagen
          allowEditing: false,
          resultType: CameraResultType.Base64,
          source: source
        });

        console.log("RESULT: ", image)
        this.inspectionPoint.fileSended = false;
        this.imagen = String(new Date());

        let imgsLocal = this.localStorageData.getImagesToSend();
        imgsLocal.push({
          id: this.imagen,
          img: 'data:image/'+ image.format +';base64,' + image.base64String
        });

        this.imageName = this.getFileName(image.format);

        // const blobImg = this.fileManagmentService.base64ToBlob(image.base64String as string, image.format);
        // const fileImg = this.fileManagmentService.blobToFile(blobImg, this.imageName);

        // NOTA: Si es online carga la imagen
        // if(await this.networkService.online()) {
        // this.loadingService.show();
        //   this.fileManagmentService.uploadHash([fileImg], "VisitaDetalle").subscribe({
        //     next: (result: any) => {
        //       this.inspectionPoint.archivoId = result.files[0].archivoId;
        //       this.notification.showMessage("Archivo cargado con éxito.");
        //       this.loadingService.hide();
        //       this.cdr.detectChanges();
        //     },
        //     error: () => {
        //       this.notification.showMessage("Error al cargar la imagen...");
        //       this.loadingService.hide();
        //       this.inspectionPoint.archivoId = null;
        //       this.imageName = null;
        //       this.cdr.detectChanges();
        //     }
        //   });
        // }
        // else { // NOTA: si es offline, se guarda para cargar cuando tenga internet
          await this.saveImage(image, this.imageName);
          this.inspectionPoint.fileName = this.imageName;
          this.inspectionPoint.fileFormat = image.format;
          this.inspectionPoint.fileOfflineSended = true;
        // }
      }
      catch (error: any) {
        if (error.code && error.message) {
          // Manejar errores específicos de la cámara
          console.error("Error de la cámara:", error.code, error.message);
        } else {
          // Manejar otros errores
          console.error("Error desconocido:", error);
        }
        this.loadingService.hide();
      }
    } else {
      this.notification.showMessage('La funcionalidad no es compatible con tu dispositivo');
      this.cdr.detectChanges();
    }
  }

  async saveImage(photo: Photo, fileName: string) {
    try {
      const base64Data = photo.base64String as string;
      const savedFile = await Filesystem.writeFile({
          path: `${fileName}`,
          data: base64Data,
          directory: Directory.Data
      });
    }
    catch(error) {
      console.error("Error desconocido:", error);
      this.notification.showMessage('Hubo un error al cargar la imagen.');
    }
  }

  private async readAsBase64(photo: Photo) {
      if (this.platform.is('hybrid')) {
          const file = await Filesystem.readFile({ path: photo.path as string });
          return file.data;
      } else {
          const response = await fetch(photo.webPath as string);
          const blob = await response.blob();
          return await this.convertBlobToBase64(blob) as string;
      }
  }

  convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
      const reader = new FileReader;
      reader.onerror = reject;
      reader.onload = () => {
          resolve(reader.result);
      };
      reader.readAsDataURL(blob);
  });

  getFileName(format: string) {
    var date = new Date();
    const userName = this.loggedUser.nombre + '_'+ this.loggedUser.apellido;
    const point = this.inspectionPoint.id;
    const fecha = `${date.getFullYear()}_${date.getMonth()}_${date.getDate()}_${date.getHours()}_${date.getMinutes()}_${date.getSeconds()}`;

    return `${userName}_${point}_${fecha}.${format}`;
  }
}
