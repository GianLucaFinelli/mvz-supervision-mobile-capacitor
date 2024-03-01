import { NgForOf, NgIf } from "@angular/common";
import { Component, Input, OnInit } from "@angular/core";
import { IonicModule } from "@ionic/angular";

@Component({
    selector: 'mvz-spinner',
    templateUrl: './mvz-spinner.component.html',
    styleUrls: ['./mvz-spinner.component.scss'],
    standalone: true,
    imports: [IonicModule, NgIf],
  })
  export class MvzSpinner implements OnInit {
    @Input() isLoading: Boolean= true;
    @Input() hasResults: Boolean= false;

    ngOnInit() {

    }
  }