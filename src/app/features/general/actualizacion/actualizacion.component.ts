import { CommonModule, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-actualizacion',
  templateUrl: './actualizacion.component.html',
  styleUrls: ['./actualizacion.component.scss'],
  standalone: true,
  imports: [IonicModule,
    FormsModule,
    CommonModule,
    NgIf,
  ]
})
export class ActualizacionComponent  implements OnInit {
// urlAppMarket:string = environment.urlPlayStoreApp + '?id=' + environment.idAppMarket;
@Input() nuevaVersion:any
@Input() esRequerido:any
  constructor(private modalController: ModalController,) { }

  ngOnInit() {
    console.log();
  }

  close(){
    this.modalController.dismiss();
  }


}
